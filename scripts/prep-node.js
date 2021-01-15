// const Oracle = require('@chainlink/contracts/truffle/v0.6/Oracle')

const clUtils = require('./cl-utils');
const Web3 = require('web3');
const EthProvider = new Web3.providers.HttpProvider("http://127.0.0.1:7545/");
const {Oracle} = require('@chainlink/contracts/truffle/v0.6/Oracle');

const GanacheChainlinkClient = artifacts.require('GanacheChainlinkClient');
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')


let env_net1 = require('dotenv').config({ path: '../build/addrs_network1.env' })
let env_net2 = require('dotenv').config({ path: '../build/addrs_network2.env' })

module.exports = async callback => {
console.log(1)
  let adr = process.argv[5] === 'network1' ? env_net1.parsed.ORACLE_CONTRACT_ADDRESS : process.argv[5] === 'network2' ? env_net2.parsed.ORACLE_CONTRACT_ADDRESS : '0x0';
console.log(process.argv[5])
  const getAddr = require('../'+process.argv[5]+'/chainlink/get-addr');

  console.log(`========================== TRANSFER ETH TO CHAINLINK NODE ON  ${adr} ==========================`);

try {
   LinkToken.setProvider(EthProvider);
   Oracle.setProvider(EthProvider);
   let oracle = await Oracle.at(adr)
   console.log(oracle.address)
	

	console.log(4)
  const accountAddr = await getAddr();
	console.log(5)
  console.log(`Setting fulfill permission to true for ${accountAddr}...`);
  const accounts = await web3.eth.getAccounts();
  const tx = await oracle.setFulfillmentPermission(accountAddr, true, {from: accounts[0]});
  console.log(`Fulfillment succeeded! Transaction ID: ${tx.tx}.`);

  
  console.log(`Sending 1 ETH from ${accounts[0]} to ${accountAddr}.`);
  const result = await web3.eth.sendTransaction({from: accounts[0], to: accountAddr, value: '100000000000000000000'});
  console.log(`Transfer succeeded! Transaction ID: ${result.transactionHash}.`);

  let adr_cl = process.argv[5] === 'network1' ? env_net1.parsed.CLIENT1_ADDRESS : process.argv[5] === 'network2' ? env_net1.parsed.CLIENT2_ADDRESS : '0x0';

  const ganacheClient = await GanacheChainlinkClient.at(adr_cl);
  const tokenAddress  = await ganacheClient.getChainlinkToken();
  const token         = await LinkToken.at(tokenAddress);
  console.log(`Transfering 5 LINK to ${ganacheClient.address}...`);
  const tx2 = await token.transfer(accountAddr, `100000000000000000000`,{from: accounts[0]});
  console.log(`Transfer succeeded! Transaction ID: ${tx2.tx}.`);
  const balance = await token.balanceOf(accountAddr);
  console.log(`Balance LINK TEKEN ON CHAINLINK NODE: ${balance.toString()}.`);
} catch(e) {
console.log(e)
}

  callback();
}
