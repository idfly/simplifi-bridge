const MyContract    = artifacts.require('MyContract')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');

let env_net1 = require('dotenv').config({ path: '../build/addrs_network1.env' })
let env_net2 = require('dotenv').config({ path: '../build/addrs_network2.env' })


module.exports = async callback => {

  LinkToken.setProvider(web3.currentProvider);
  
  let link = process.argv[5] === 'network1' ? env_net1 : process.argv[5] === 'network2' ? env_net2 : '0x0';

  console.log(`========================== TRANSFER LINKS TO ${link.parsed.CLIENT_ADDRESS} ON NETWORK ${process.argv[5]} ==========================\n`);

  const myContract    = await MyContract.at(link.parsed.CLIENT_ADDRESS);
  const tokenAddress  = await myContract.getChainlinkToken();
  const token         = await LinkToken.at(tokenAddress);
  const tx            = await token.transfer(myContract.address, `100000000000000000000`, { from: (await web3.eth.getAccounts())[0] });

  console.log(`Transfer succeeded! Transaction ID: ${tx.tx}.`);
  console.log(`Balance recepient: ${myContract.address} is: ${(await token.balanceOf(myContract.address)).toString()} LINK`);
  

  callback();
}