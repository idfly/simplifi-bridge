const DexPool    = artifacts.require('DexPool')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');

let env_net1 = require('dotenv').config({ path: '../build/addrs_network1.env' })
let env_net2 = require('dotenv').config({ path: '../build/addrs_network2.env' })


module.exports = async callback => {

  LinkToken.setProvider(web3.currentProvider);
  
  let pool = process.argv[5] === 'network1' ? env_net1.parsed.POOL1_ADDRESS : process.argv[5] === 'network2' ? env_net2.parsed.POOL2_ADDRESS : '0x0';
  let linkadr = process.argv[5] === 'network1' ? env_net1: process.argv[5] === 'network2' ? env_net2 : '0x0';

  console.log(`========================== TRANSFER LINKS TO ${pool} ON NETWORK ${process.argv[5]} ==========================\n`);

  
  
  const token         = await LinkToken.at(linkadr.parsed.LINK_CONTRACT_ADDRESS);
  const tx            = await token.transfer(pool, `100000000000000000000`, { from: (await web3.eth.getAccounts())[0] });

  console.log(`Transfer succeeded! Transaction ID: ${tx.tx}.`);
  console.log(`Balance recepient: ${pool} is: ${(await token.balanceOf(pool)).toString()} LINK`);
  

  callback();
}