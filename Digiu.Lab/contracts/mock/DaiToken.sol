pragma solidity 0.6.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DaiToken is ERC20("Dai Token", "DAI") {
  constructor() public {
  	mint(msg.sender, 100000000000000000000);
  }

  function mint(address _account, uint256 _amount) public {
    _mint(_account, _amount);
  }

  function burn(address _account, uint256 _amount) external {
    _burn(_account, _amount);
  }
}