//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.8.0;

// import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import './PoolCollateralToken.sol';

contract DFactory {
     mapping(address => address) public getCollateralToken;
     address[] public allCollateralTokens;

event PoolCollateralTokenCreated (address token, address token2, uint l);

 function collateralTokensLength() external view returns (uint){
    return allCollateralTokens.length;
 }

function createCollateralTokenInPool(address tokenA) external returns (address pcl){
     require(getCollateralToken[tokenA] == address(0), ': CollateralTokenInPool_EXISTS'); // single check is sufficient
       
 bytes memory bytecode = type(PoolCollateralToken).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(tokenA));
        assembly {
          pcl := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        PoolCollateralToken(pcl).initialize(tokenA);
        getCollateralToken[tokenA] = pcl;
        allCollateralTokens.push(pcl);
        emit PoolCollateralTokenCreated(tokenA, pcl, allCollateralTokens.length);
}




}