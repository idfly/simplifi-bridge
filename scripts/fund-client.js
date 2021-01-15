const Web3 = require('web3');
const EthProvider = new Web3.providers.HttpProvider("http://127.0.0.1:7545/");

const GanacheChainlinkClient = artifacts.require('GanacheChainlinkClient');
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')

LinkToken.setProvider(EthProvider);
GanacheChainlinkClient.setProvider(EthProvider);

module.exports = async callback => {
	try {
  const ganacheClient = await GanacheChainlinkClient.deployed();
  const tokenAddress = await ganacheClient.getChainlinkToken();
  const token = await LinkToken.at(tokenAddress);
  console.log(`Transfering 5 LINK to ${ganacheClient.address}...`);
  const tx = await token.transfer(ganacheClient.address, `5000000000000000000`);
  console.log(`Transfer succeeded! Transaction ID: ${tx.tx}.`);
  } catch(e) {
  	console.log(e)
  }
  callback();

}
