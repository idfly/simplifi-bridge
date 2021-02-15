const Oracle     = artifacts.require('Oracle')
const DexPool    = artifacts.require('DexPool')
const MyContract = artifacts.require('MyContract')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');


let env = require('dotenv').config({ path: `../../build/addrs_${process.argv[5]}.env` });


module.exports = async callback => {
try{
  
      const myContract    = await MyContract.at(env.parsed.CLIENT_ADDRESS);
      /*let tx            = await myContract.setJobID(await web3.utils.fromAscii("54faa5d7b4d64c3a9c38508cc21e47c5"));
      
      console.log(`>>>>>>> SET JOBID: ${myContract.address} ON NETWORK ${process.argv[5]}\ntx:${tx.tx}\n\n`);*/

      const oracle        = await Oracle.at(env.parsed.ORACLE_CONTRACT_ADDRESS);
            tx            = await oracle.setPermissionJobId(await web3.utils.fromAscii("5b46dac8b3bb40ab91c7ab1b48fddef9"));

	   console.log(`>>>>>>> SET PermissionJobId: ${myContract.address} ON NETWORK ${process.argv[5]}\ntx:${tx.tx}\n\n`);

	  let allJOBID            = await oracle.getPermissionJobId();
	  console.log(`LIST JOBID: ${allJOBID}`);

    
  
}catch(e){console.log(e);}
  callback();
}

// e349165b20ef4f25a06c065cbd5f4b17 net2
// 0389c63bc0d041cea65ab4fceb5e1eb9

// e42ec7897baf45da8e0f7fa3e6a4e902 5b46dac8b3bb40ab91c7ab1b48fddef9