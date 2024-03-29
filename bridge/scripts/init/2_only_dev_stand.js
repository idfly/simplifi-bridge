const Bridge    = artifacts.require('Bridge')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');
const { Oracle }    = require('@chainlink/contracts/truffle/v0.6/Oracle');

let env                 = require('dotenv').config({ path: `../../build/addrs_${process.argv[5]}.env` });
const { initAddresses } = require('../../utils/helper');



module.exports = async callback => {
try{

	//if(process.argv[5] === 'network1' || process.argv[5] === 'network2'){
	  LinkToken.setProvider(web3.currentProvider);
	  Oracle.setProvider(web3.currentProvider);
	  
	  let addresses = await initAddresses(process.argv[5], env);
	  
	  let per = null;
	  if(process.argv[5] === 'network1' || process.argv[5] === 'rinkeby')        per =  'network1';
	  if(process.argv[5] === 'network2' || process.argv[5] === 'binancetestnet') per =  'network2';
	  const getAddr = require(`../../${per}/chainlink/get-addr`);

	  let port = null;
	  if (process.argv[5] === 'network1' || process.argv[5] === 'rinkeby') port = ['6688','7000'];
	  if (process.argv[5] === 'network2' || process.argv[5] === 'binancetestnet') port = ['6689','7002'];
	  for(let i = 0; i < port.length; i ++){

		  const accountAddr = await getAddr(port[i]);
		  let oracle        = await Oracle.at(addresses.ORACLE_CONTRACT_ADDRESS);
		  const accounts    = await web3.eth.getAccounts();
	      const tx          = await oracle.setFulfillmentPermission(accountAddr, true, {from: accounts[0]});
	      console.log(`oracle.setFulfillmentPermission(${accountAddr}): ${tx.tx}.`);

	      const result = await web3.eth.sendTransaction({from: accounts[0], to: accountAddr, value: web3.utils.toWei('0.1', 'ether')});
	      console.log(`web3.eth.sendTransaction({from:${accounts[0]} to:${accountAddr} value:100`);
	  //}    
	}  
}catch(e){console.log(e);}
  callback();
}
