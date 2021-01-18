const { Oracle }    = require('@chainlink/contracts/truffle/v0.6/Oracle');
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const MyContract    = artifacts.require('MyContract');


let env_net1 = require('dotenv').config({ path: '../build/addrs_network1.env' })
let env_net2 = require('dotenv').config({ path: '../build/addrs_network2.env' })

module.exports = async callback => {
try{
  let adrOracle = process.argv[5] === 'network1' ? env_net1.parsed.ORACLE_CONTRACT_ADDRESS : process.argv[5] === 'network2' ? env_net2.parsed.ORACLE_CONTRACT_ADDRESS : '0x0';

  const getAddr = require('../'+process.argv[5]+'/chainlink/get-addr');

  console.log(`========================== TRANSFER ETH/LINK ON CHAINLINK NODE ON  ${await getAddr()} ==========================\n`);


   LinkToken.setProvider(web3.currentProvider);
   Oracle.setProvider(web3.currentProvider);
   let oracle = await Oracle.at(adrOracle)
   
	
  const accountAddr = await getAddr();
	console.log(`Setting fulfill permission to true for ${accountAddr} on oracle: ${oracle.address}`);
  const accounts = await web3.eth.getAccounts();
  const tx       = await oracle.setFulfillmentPermission(accountAddr, true, {from: accounts[0]});
  console.log(`Fulfillment succeeded! Transaction ID: ${tx.tx}.`);

  
  console.log(`Sending 100 ETH from ${accounts[0]} to ${accountAddr}.`);
  const result = await web3.eth.sendTransaction({from: accounts[0], to: accountAddr, value: '100000000000000000000'});
  console.log(`Transfer succeeded! Transaction ID: ${result.transactionHash}.`);

  let adr_cl = process.argv[5] === 'network1' ? env_net1.parsed.CLIENT_ADDRESS : process.argv[5] === 'network2' ? env_net2.parsed.CLIENT_ADDRESS : '0x0';

  const myContract    = await MyContract.at(adr_cl);
  const tokenAddress  = await myContract.getChainlinkToken();
  const token         = await LinkToken.at(tokenAddress);
  console.log(`Transfering 100 LINK to ${myContract.address}...`);
  const tx2           = await token.transfer(accountAddr, `100000000000000000000`,{from: accounts[0]});
  console.log(`Transfer succeeded! Transaction ID: ${tx2.tx}.`);
  const balance       = await token.balanceOf(accountAddr);
  console.log(`Balance LINK TEKEN ON CHAINLINK NODE: ${balance.toString()}.`);

}catch(e){console.log(e);}
  callback();
}
