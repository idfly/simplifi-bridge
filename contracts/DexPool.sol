pragma solidity >=0.4.21 < 0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MyContract.sol";
import "./IHexstring.sol";


contract DexPool is Ownable {

  event Receive(bool success);
  uint256 public test;
  address myContract;
  address util;


  address tokenOfPool;

  constructor(address _tokenOfPool, address _myContract, address _util) public {

  	tokenOfPool = _tokenOfPool;
  	myContract  = _myContract;
    util        = _util;

  }

  function _setTest(uint256 val) external {
  	test = val;
  }
  function _getTest(uint256 val) external {
  	test = val;
  }

 /**
  * Receive invoke from other network through external adapter
  * 
  */
  function receiver(bytes memory b) external onlyOwner {
    (bool success, bytes memory data) = address(this).call(b);
    require(success && (data.length == 0 || abi.decode(data, (bool))), 'FAILED');

    emit Receive(success);
  }



  /** 
   * The part of process 'swap'
   */
  function swapDeposit(uint256 amount) external {

//      require(IERC20(tokenOfPool).balanceOf(address(this)) >= amount, "INSUFFICIENT AMOUNT IN SWAPDEPOSIT");

      // перевод usdc c адреса alice на адрес пула в сети ethereum (перед этим она должна сделать approve)
//      IERC20(tokenOfPool).transferFrom(msg.sender, address(this), amount);

     bytes memory out = abi.encodeWithSelector(bytes4(keccak256(bytes('_setTest(uint256)'))), amount);

     //byte to string

     //MyContract(myContract).createRequestTo("7e580cc1000000000000000000000000000000000000000000000000000000000000000a");
     MyContract(myContract).createRequestTo("7e580cc1");
     //MyContract(myContract).createRequestTo(IHexstring(util).bytesToHexString(out));
     
      
  
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



}