pragma solidity >=0.4.21 < 0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MyContract.sol";
import "./IHexstring.sol";

abstract contract ERC20 is IERC20 {}


contract DexPool is Ownable {

  event Receive(bool success);
  event SwapDeposit(bytes32 requestId, uint256 curBlock);
  event SwapWithdraw(address recipient, uint256 amount);
  event TxCompleteBothChain(bytes32 requestId, bytes32 tx_fromNet2);

  string constant private SET_REQUEST_TYPE = "set";
  string constant private GET_REQUEST_TYPE = "get";

  uint256 public test;
  address public myContract;
  address public util;

  // requestId => tx (callback, where tx.status === true)
  mapping(bytes32 => bytes32) private pendingRequests;

  address tokenOfPool;

  constructor(address _tokenOfPool,
              address _myContract,
              address _util ) 
  public {

  	tokenOfPool = _tokenOfPool;
  	myContract  = _myContract;
    util        = _util;

  }

  /** 
   * The part of process 'swap'
   */
  function swapDeposit(uint256 amount, address recipientOnNet2) external {

    require(recipientOnNet2 != address(0), "ZERO_ADDRESS");
    //перевод usdc(BNB) c адреса alice на адрес пула в сети ethereum(Binance)
    IERC20(tokenOfPool).transferFrom(msg.sender, address(this), amount);

     //prepare
     bytes memory out = abi.encodeWithSelector(bytes4(keccak256(bytes('_setTest(uint256)'))), amount);
     //byte to string and send to Net2
     bytes32 requestId = MyContract(myContract).transmit(SET_REQUEST_TYPE, IHexstring(util).bytesToHexString(out));
     //save requestId for bind with callback requestId -> this is approve consistaency !!!!
     // hex"0x0" - in pending
     pendingRequests[requestId] = "0x0";

     emit SwapDeposit(requestId, block.number);
     
   }

   function setPendingRequestsDone(bytes32 requestId ,bytes32 tx_fromNet2) public {

      require(msg.sender == myContract, "ONLY CERTAIN CHAINLINK CLIENT");
      // transation on overside is executed. tx.status = true
      pendingRequests[requestId] = tx_fromNet2;

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
  function receiver(bytes memory b) external onlyOwner {
    (bool success, bytes memory data) = address(this).call(b);
    require(success && (data.length == 0 || abi.decode(data, (bool))), 'FAILED');

    emit Receive(success);
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