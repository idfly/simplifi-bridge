const Bridge = artifacts.require('Bridge')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');
const fs = require('fs');

let env = require('dotenv').config({ path: `../../build/addrs_${process.argv[5]}.env` });
let jobSpecId = fs.readFileSync(`../../build/${process.argv[6]}.id`, 'utf-8');



module.exports = async callback => {
try{
  
      const myContract    = await Bridge.at(env.parsed.CLIENT_ADDRESS);
      let tx = await myContract.setPermissionJobId(await web3.utils.fromAscii(jobSpecId.trim()));
      console.log(`>>>>>>> SET PermissionJobId: ${myContract.address} ON NETWORK ${process.argv[5]}\ntx:${tx.tx}\n\n`);

      let allJOBID        = await myContract.getPermissionJobId();
	    console.log(`LIST JOBID: ${allJOBID}`);

    
  
}catch(e){console.log(e);}
  callback();
}
