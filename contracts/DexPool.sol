pragma solidity >=0.4.21 < 0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MyContract.sol";
import "./IHexstring.sol";
import "./GovernanceToken.sol";
import './libraries/Math.sol';

abstract contract ERC20 is IERC20 {}


contract DexPool is GovernanceToken, Ownable {

  event Receive(bool success);
  event SwapDeposit(bytes32 requestId, uint256 curBlock);
  event SwapWithdraw(address recipient, uint256 amount);
  event TxCompleteBothChain(bytes32 requestId, bytes32 tx_fromNet2);
  event AddLiquidity(bytes32 requestId, uint256 curBlock);
  event Mint(address indexed sender, uint amount0, uint amount1);

  struct SimpleState {
    address recepient;
    uint256 amount1;
    uint256 amount2;
    uint256 balancePool2;
    bytes32 tx;
    bytes32 func;
  }

  string constant private SET_REQUEST_TYPE = "set";
  string constant private GET_REQUEST_TYPE = "get";
  uint   constant private MINIMUM_LIQUIDITY = 10**3;

  uint256 public test;
  address public myContract;
  address public util;
  uint256 private test_agregator; 

  // requestId => tx (callback, where tx.status === true)
  mapping(bytes32 => SimpleState) private pendingRequests;

  address tokenOfPool;

  constructor(address _tokenOfPool,
              address _myContract,
              address _util ) 
  public {

    tokenOfPool = _tokenOfPool;
    myContract  = _myContract;
    util        = _util;

  }


function _addLiquidity(address luqidityProvider, uint256 amount) public {
     require(msg.sender == address(this), "ONLY YOURSELF");
     require(luqidityProvider != address(0), "ZERO_ADDRESS");

     IERC20(tokenOfPool).transferFrom(luqidityProvider, address(this), amount);
     
}

function addLiquidity(uint256 amountNet1,
                      uint256 amountNet2,
                      address luqidityProviderNet2,
                      uint256 balancePoolNet2
 ) external {

  require(luqidityProviderNet2 != address(0), "ZERO_ADDRESS");
  //TODO WARN how does check the balance senderNet2 ?
  //TODO invoke only bsc
  
  IERC20(tokenOfPool).transferFrom(msg.sender, address(this), amountNet1);
  bytes memory out  = abi.encodeWithSelector(bytes4(keccak256(bytes('_addLiquidity(address,uint256)'))), luqidityProviderNet2, amountNet2);
  bytes32 requestId = MyContract(myContract).transmit(SET_REQUEST_TYPE, IHexstring(util).bytesToHexString(out));

  SimpleState storage simpleState = pendingRequests[requestId];
  simpleState.recepient    = msg.sender;
  simpleState.amount1      = amountNet1;
  simpleState.amount2      = amountNet2;
  simpleState.balancePool2 = balancePoolNet2;
  simpleState.tx           = "0x0";
  simpleState.func         = "addLiquidity";
  //TODO mint LP token after executing tx on net1 and net2 (balancePoolNet1 + balancePoolNet2)
  //mint(msg.sender, amountNet1, amountNet2, balancePoolNet2);

  emit AddLiquidity(requestId, block.number);
}


  /** 
   * The part of process 'swap'
   */
  function swapDeposit(uint256 amount1, uint256 amount2, address recipientOnNet2) external {

    require(recipientOnNet2 != address(0), "ZERO_ADDRESS");
    //перевод usdc(BNB) c адреса alice на адрес пула в сети ethereum(Binance)
    IERC20(tokenOfPool).transferFrom(msg.sender, address(this), amount1);

     //prepare
     bytes memory out = abi.encodeWithSelector(bytes4(keccak256(bytes('swapWithdraw(address,uint256)'))), recipientOnNet2, amount2);
     //byte to string and send to Net2
     bytes32 requestId = MyContract(myContract).transmit(SET_REQUEST_TYPE, IHexstring(util).bytesToHexString(out));
     //save requestId for bind with callback requestId -> this is approve consistaency !!!!
     
     SimpleState storage simpleState = pendingRequests[requestId];
     simpleState.tx           = "0x0";
     simpleState.func         = "swapDeposit";

     emit SwapDeposit(requestId, block.number);
     
   }

   function setPendingRequestsDone(bytes32 requestId ,bytes32 tx_fromNet2) public {

      require(msg.sender == myContract, "ONLY CERTAIN CHAINLINK CLIENT");
      // transation on overside is executed. tx.status = true
      //TODO check simpleState is not null
      SimpleState storage simpleState = pendingRequests[requestId];
      simpleState.tx = tx_fromNet2;

      if(simpleState.func == bytes32("addLiquidity")) mint(simpleState.recepient, simpleState.amount1, simpleState.amount2, simpleState.balancePool2);

      emit TxCompleteBothChain(requestId, tx_fromNet2);
  }

  /** 
   * The part of process 'swap'
   * 
   */
  function swapWithdraw(address recipient,uint256 amount) public {

      require(IERC20(tokenOfPool).balanceOf(address(this)) >= amount, "INSUFFICIENT AMOUNT IN SWAPWITHDRAW");
      require(msg.sender == address(this), "ONLY YOURSELF");
      //перевод BNB(USDC) c адреса пула на адрес alice в сети Binance(Ethereum)
      IERC20(tokenOfPool).transfer(recipient, amount);

      emit SwapWithdraw(msg.sender, amount);

   }

   function mint(address to, 
                 uint amount0, 
                 uint amount1,
                 uint balancePoolNet2) private returns (uint liquidity) {
        //(uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        uint256 _reserve0 = IERC20(tokenOfPool).balanceOf(address(this)) - amount0; // баланс пула1 до зачисления на него средств
        uint256 _reserve1 = balancePoolNet2; // баланс пула2 до зачисления на него средств (приходит с фронта)
        //uint balance0 = IERC20(token0).balanceOf(address(this));
        uint balance0 = IERC20(tokenOfPool).balanceOf(address(this)); // текущий баланс (после зачисления от участника)
        //uint balance1 = IERC20(token1).balanceOf(address(this));
        uint balance1 = balancePoolNet2 + amount1; // текущий баланс. так как баланс к нам пришел до зачисления средств от учестника, это во второй сети
        //uint amount0 = balance0.sub(_reserve0);
        //uint amount1 = balance1.sub(_reserve1);

        //bool feeOn = _mintFee(_reserve0, _reserve1);
        uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);
           _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
        } else {
            liquidity = Math.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);
        }
        require(liquidity > 0, 'UniswapV2: INSUFFICIENT_LIQUIDITY_MINTED');
        _mint(to, liquidity);

        //_update(balance0, balance1, _reserve0, _reserve1);
        //if (feeOn) kLast = uint(reserve0).mul(reserve1); // reserve0 and reserve1 are up-to-date
        emit Mint(msg.sender, amount0, amount1);
    }


    function calculateLP(uint amount0, 
                         uint amount1,
                         uint balancePoolNet2) external view returns (uint256 liquidity) {
        
        uint256 _reserve0 = IERC20(tokenOfPool).balanceOf(address(this));
        uint256 _reserve1 = balancePoolNet2;
        
        uint balance0 = IERC20(tokenOfPool).balanceOf(address(this)) + amount0;
        uint balance1 = balancePoolNet2 + amount1;

        uint _totalSupply = totalSupply;
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);
           
        } else {
            liquidity = Math.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);
        }
    }



   /*
    *
    *  ==========================FOR INCOMING FROM OVER SIDE =======================================
    */


  function _setTest(uint256 val) public  {

    require(msg.sender == address(this), "ONLY YOURSELF");

    test = val;
  }
  function _getTest() public view returns (uint256)  {

    require(msg.sender == address(this), "ONLY YOURSELF");

    return test;
  }


 /**
  * Receive invoke from other network through external adapter
  * Change state smart-contrat
  *
  * NOTE: owner - it's deployer address. 
  */

  //TODO agregator logic && smart ecrecover && nonce
  function receiver(bytes32 jobRunID, bytes memory signature, bytes memory b) external /*onlyOwner*/ {
    bytes32 hash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(jobRunID, b)));
    address res  = ECDSA.recover(hash, signature);
    //require(msg.sender == res, "sender is not owner signature");

    if(test_agregator == 2){
      (bool success, bytes memory data) = address(this).call(b);
      require(success && (data.length == 0 || abi.decode(data, (bool))), 'FAILED');
      test_agregator = 0;
      
      emit Receive(success);
    }else{
      test_agregator++;
    }
  }
 /**
  * Receive invoke from other network through external adapter
  * Staticcall (read state smart-contrat)
  *
  * 
  */
  function lowLevelGet(bytes memory b) public view returns (bytes32) {
      (bool success, bytes memory data) = address(this).staticcall(b);
        if (!success || data.length == 0) {
            return '';
        }
      return abi.decode(data, (bytes32));
  }






}
