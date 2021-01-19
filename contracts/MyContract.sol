pragma solidity >=0.4.21 < 0.7.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./DexPool.sol";


contract MyContract is ChainlinkClient, Ownable {
  
  //TODO к коефиге ноды чейнлинка стоит 1 линк. Попытаться исправить
  uint256 constant private ORACLE_PAYMENT = 1 * LINK; // 0.1 * 10 ** 18; // 0.1 LINK
  address public oracle;
  bytes32 public jobId;
  

  // requestId => recipient
  mapping(bytes32 => address) private routeForCallback;
  
  /**
   * @notice Deploy the contract with a specified address for the LINK
   * and Oracle contract addresses
   * @dev Sets the storage for the specified addresses
   * @param _link The address of the LINK token contract
   */
  constructor(address _link, address _oracle) public {

    oracle      = _oracle;

    if (_link == address(0)) {
      setPublicChainlinkToken();
    } else {
      setChainlinkToken(_link);
    }
  }

  function setJobID(bytes32 val) external onlyOwner {
    jobId = val;
  }
  function setOracle(address val) external onlyOwner {
    oracle = val;
  }



  /**
   * @notice Returns the address of the LINK token
   * @dev This is the public implementation for chainlinkTokenAddress, which is
   * an internal method of the ChainlinkClient contract
   */
  function getChainlinkToken() public view returns (address) {
    return chainlinkTokenAddress();
  }


  function transmit(string memory  _selector)
    public
    /*onlyOwner*/
    returns (bytes32 requestId)
  {
    Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.callback.selector);
    req.add("selector", _selector);
    requestId = sendChainlinkRequestTo(oracle, req, ORACLE_PAYMENT);

    routeForCallback[requestId] = msg.sender;

  }

  /**
   * @notice The callback method from requests created by transmit
   * @dev The recordChainlinkFulfillment protects this function from being called
   * by anyone other than the oracle address that the request was sent to
   * @param _requestId The ID that was generated for the request
   * @param _data The answer provided by the oracle. In this case tx.
   */
  function callback(bytes32 _requestId, bytes32 _data)
    public
    recordChainlinkFulfillment(_requestId)
  {
    
    DexPool(routeForCallback[_requestId]).setPendingRequestsDone(_requestId, _data);
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
