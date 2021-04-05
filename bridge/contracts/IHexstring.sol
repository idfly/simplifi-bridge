pragma solidity >=0.4.21 < 0.7.0;


interface IHexstring {

	function bytesToHexString(bytes memory value) external view returns(string memory);

}