pragma solidity >=0.4.21 < 0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MyContract.sol";
import "./IHexstring.sol";


contract DexPool is Ownable {

  event Receive(bool success);

  uint256 public test;
  address public myContract;
  address public util;

  // requestId => tx (callback, where tx.status === true)
  mapping(bytes32 => bytes32) private pendingRequests;

  address tokenOfPool;

  constructor(address _tokenOfPool, address _myContract, address _util) public {

  	tokenOfPool = _tokenOfPool;
  	myContract  = _myContract;
    util        = _util;

  }

  /** 
   * The part of process 'swap'
   */
  function swapDeposit(uint256 amount) external {

      //TODO
      // require(IERC20(tokenOfPool).balanceOf(address(this)) >= amount, "INSUFFICIENT AMOUNT IN SWAPDEPOSIT");
      // //перевод usdc c адреса alice на адрес пула в сети ethereum (перед этим она должна сделать approve)
      // IERC20(tokenOfPool).transferFrom(msg.sender, address(this), amount);

     //prepare
     bytes memory out = abi.encodeWithSelector(bytes4(keccak256(bytes('_setTest(uint256)'))), amount);

     //byte to string and send to Net2
     bytes32 requestId = MyContract(myContract).transmit(IHexstring(util).bytesToHexString(out));

     //save requestId for bind with callback requestId -> this is approve consistaency !!!!
     // hex"0x0" - in pending
     pendingRequests[requestId] = "0x0";
     
   }

   function setPendingRequestsDone(bytes32 requestId ,bytes32 tx_fromNet2) public {

      require(msg.sender == myContract, "ONLY CERTAIN CHAINLINK CLIENT");

      // transation on overside is executed. tx.status = true
      pendingRequests[requestId] = tx_fromNet2;

   }

  /** 
   * The part of process 'swap'
   * NOTE: permission onlyOwner
   /
  function swapWithdraw(address recipient,uint256 amount) onlyOwner external {

      //WARN рассмотреть негативный сценарий где данная функция вызывается первой из всего процесса.


      require(IERC20(tokenOfPool).balanceOf(address(this)) >= amount, "INSUFFICIENT AMOUNT IN SWAPWITHDRAW");

      //перевод BNB c адреса пула на адрес alice в сети Binance
      IERC20(tokenOfPool).transfer(recipient, amount);

      //TODO
      //createRequestTo(...); - на случай коллбэка о событии транзакции в другую 

   }*/



   /*
    *
    *  ==========================FOR INCOMING FROM OVER SIDE =======================================
    */


  function _setTest(uint256 val) public  {

    require(msg.sender == address(this), "ONLY YOURSALF");

    test = val;
  }


 /**
  * Receive invoke from other network through external adapter
  *
  * NOTE: owner - it's deployer address. 
  */
  function receiver(bytes memory b) external onlyOwner {
    (bool success, bytes memory data) = address(this).call(b);
    require(success && (data.length == 0 || abi.decode(data, (bool))), 'FAILED');

    emit Receive(success);
  }






}