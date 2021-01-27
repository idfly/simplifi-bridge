pragma solidity =0.6.9;

import './libraries/SafeMath.sol';

contract GovernanceToken {
    using SafeMath for uint;

    string public constant name     = 'DigiU';
    string public constant symbol   = 'DGU';
    uint8  public constant decimals = 18;
    uint   public totalSupply;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    constructor() public {}

    function _mint(address to, uint value) internal {
        totalSupply   = totalSupply.add(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(address(0), to, value);
    }


}
