const Oracle     = artifacts.require('Oracle')
const DexPool    = artifacts.require('DexPool')
const MyContract = artifacts.require('MyContract')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');


let env = require('dotenv').config({ path: `../../build/addrs_${process.argv[5]}.env` });


module.exports = async callback => {
try{
  
      const myContract    = await MyContract.at(env.parsed.CLIENT_ADDRESS);
      const tx            = await myContract.setJobID(await web3.utils.fromAscii("d1a27394830b43f7997e38345921323a"));
      
      console.log(`>>>>>>> SET JOBID: ${myContract.address} ON NETWORK ${process.argv[5]}\ntx:${tx.tx}\n\n`);

      const oracle        = await Oracle.at(env.parsed.ORACLE_CONTRACT_ADDRESS);
            tx            = await oracle.setPermissionJobId(await web3.utils.fromAscii("d1a27394830b43f7997e38345921323a"));

	   console.log(`>>>>>>> SET PermissionJobId: ${myContract.address} ON NETWORK ${process.argv[5]}\ntx:${tx.tx}\n\n`);            

    
  
}catch(e){console.log(e);}
  callback();
}

// e349165b20ef4f25a06c065cbd5f4b17 net2
// af81bbdb84a74c039dceda6d9b661f20