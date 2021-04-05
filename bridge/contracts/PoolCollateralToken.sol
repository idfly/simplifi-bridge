//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.8.0;

contract PoolCollateralToken {

    address public factory;
    address public token;


    constructor() public {
        factory = msg.sender;
    }

    function initialize(address _token) external {
        require(msg.sender == factory, 'Not a factory: FORBIDDEN'); // sufficient check
        token = _token;
    }


    
}