const MyContract    = artifacts.require('MyContract')
const DexPool       = artifacts.require('DexPool')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');

let env_net1 = require('dotenv').config({ path: '../build/addrs_network1.env' })
let env_net2 = require('dotenv').config({ path: '../build/addrs_network2.env' })

/**
*
*	FOR DEBUG 
*/

module.exports = async callback => {
try{
	LinkToken.setProvider(web3.currentProvider);
	

	let currentPool = process.argv[5] === 'network1' ? env_net1.parsed.POOL1_ADDRESS : process.argv[5] === 'network2' ? env_net2.parsed.POOL2_ADDRESS : '0x0';
	let activeEnv   = process.argv[5] === 'network1' ? env_net1 : process.argv[5] === 'network2' ? env_net2 : '0x0';

	const dexPool       = await DexPool.at(currentPool);
	const myContract    = await MyContract.at(activeEnv.parsed.CLIENT_ADDRESS);

	console.log('myContract.jobId: ', await myContract.jobId());
	console.log('myContract.oracle: ', await myContract.oracle());
	console.log('dexPool.myContract: ', await dexPool.myContract());
	console.log('dexPool.util: ', await dexPool.util());

	console.log('data: ', await myContract.data());


	//const tokenAddress  = await myContract.getChainlinkToken();
	//const token         = await LinkToken.at(tokenAddress);
	//await myContract.transferOwnership(dexPool.address, { from: (await web3.eth.getAccounts())[0] });
	
    const tx = await dexPool.swapDeposit('100');
    console.log('Transfer succeeded! Transaction ID:', JSON.stringify(tx));

    
    /*let callbackdata = await myContract.data();
    console.log('callbackdata ', callbackdata.toString());*/

    
    
}catch(e){console.log(e);}
  callback();
}

