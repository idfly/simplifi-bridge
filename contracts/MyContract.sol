pragma solidity >=0.4.21 < 0.7.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MyContract is an example contract which requests data from
 * the Chainlink network
 * @dev This contract is designed to work on multiple networks, including
 * local test networks
 */
contract MyContract is ChainlinkClient, Ownable {
  uint256 public data;

  /**
     Token pool
  */

    address public tokenOfPool; 
    
  /**
   * @notice Deploy the contract with a specified address for the LINK
   * and Oracle contract addresses
   * @dev Sets the storage for the specified addresses
   * @param _link The address of the LINK token contract
   */
  constructor(address _link, address _tokenOfPool) public {

    tokenOfPool = _tokenOfPool;
    
    if (_link == address(0)) {
      setPublicChainlinkToken();
    } else {
      setChainlinkToken(_link);
    }
  }


  /*function addLiquidity(address from, address _tokenPoolCurrent, address _tokenPoolBeyBeyond, uint256 amountA, uint256 amountB) external {

      //проверки пропускаем 

      // перевод usdc c адреса alice на адрес пула в сети ethereum (перед этим она должна сделать approve)
      IERC20(_tokenPoolCurrent).transferFrom(from, address(this), amountA);
      
      //TODO
      //createRequestTo(...); => пример вызова через адаптер addLiquidity(address from, address _tokenPoolCurrent, address _tokenPoolBeyBeyond, uint256 amountA, uint256 amountB) 
  
  }*/


  /** 
    The part of process 'swap'
  */
  function swapDeposit(uint256 amount) external {

      require(IERC20(tokenOfPool).balanceOf(address(this)) >= amount, "INSUFFICIENT AMOUNT IN SWAPDEPOSIT");

      // перевод usdc c адреса alice на адрес пула в сети ethereum (перед этим она должна сделать approve)
      IERC20(tokenOfPool).transferFrom(msg.sender, address(this), amount);
      
      //TODO
      //createRequestTo(...); => пример вызова адаптером swapWithdraw(msg.sender, amount)
  
  }

  /** 
    The part of process 'swap'
    NOTE: permission onlyOwner
  */
  function swapWithdraw(address recipient, uint256 amount) onlyOwner external {

      //WARN рассмотреть негативный сценарий где данная функция вызывается первой из всего процесса.


      require(IERC20(tokenOfPool).balanceOf(address(this)) >= amount, "INSUFFICIENT AMOUNT IN SWAPWITHDRAW");

      //перевод BNB c адреса пула на адрес alice в сети Binance
      IERC20(tokenOfPool).transfer(recipient, amount);

      //TODO
      //createRequestTo(...); - на случай коллбэка о событии транзакции в другую 

   }

  /**
   * @notice Returns the address of the LINK token
   * @dev This is the public implementation for chainlinkTokenAddress, which is
   * an internal method of the ChainlinkClient contract
   */
  function getChainlinkToken() public view returns (address) {
    return chainlinkTokenAddress();
  }

  /**
   * @notice Creates a request to the specified Oracle contract address
   * @dev This function ignores the stored Oracle contract address and
   * will instead send the request to the address specified
   * @param _oracle The Oracle contract address to send the request to
   * @param _jobId The bytes32 JobID to be executed
   * @param _url The URL to fetch data from
   * @param _path The dot-delimited path to parse of the response
   * @param _times The number to multiply the result by
   */
  function createRequestTo(
    address _oracle,
    bytes32 _jobId,
    uint256 _payment,
    string memory _url,
    string memory _path,
    int256 _times
  )
    public
    onlyOwner
    returns (bytes32 requestId)
  {
    Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
    req.add("url", _url);
    req.add("path", _path);
    req.addInt("times", _times);
    requestId = sendChainlinkRequestTo(_oracle, req, _payment);
  }

  /**
   * @notice The fulfill method from requests created by this contract
   * @dev The recordChainlinkFulfillment protects this function from being called
   * by anyone other than the oracle address that the request was sent to
   * @param _requestId The ID that was generated for the request
   * @param _data The answer provided by the oracle
   */
  function fulfill(bytes32 _requestId, uint256 _data)
    public
    recordChainlinkFulfillment(_requestId)
  {
    data = _data;
  }

  /**
   * @notice Allows the owner to withdraw any LINK balance on the contract
   */
  function withdrawLink() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  /**
   * @notice Call this method if no response is received within 5 minutes
   * @param _requestId The ID that was generated for the request to cancel
   * @param _payment The payment specified for the request to cancel
   * @param _callbackFunctionId The bytes4 callback function ID specified for
   * the request to cancel
   * @param _expiration The expiration generated for the request to cancel
   */
  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
    onlyOwner
  {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }
}
