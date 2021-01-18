const MyContract    = artifacts.require('MyContract')

let env_net1 = require('dotenv').config({ path: '../build/addrs_network1.env' })
let env_net2 = require('dotenv').config({ path: '../build/addrs_network2.env' })


module.exports = async callback => {
try{
  let activeEnv = process.argv[5] === 'network1' ? env_net1 : process.argv[5] === 'network2' ? env_net2 : '0x0';

  const myContract    = await MyContract.at(activeEnv.parsed.CLIENT_ADDRESS);
  const tx            = await myContract.setJobID(web3.utils.fromAscii("37a0d7ea3b774dcba82adc18fe9afd86"));
  

  console.log(`setJobID succeeded! Transaction ID: ${tx.tx}.`);
 }catch(e){console.log(e);}
  callback();
}