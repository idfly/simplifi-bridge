const DexPool    = artifacts.require('DexPool')
const MyContract = artifacts.require('MyContract')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');


let env = require('dotenv').config({ path: `../../build/addrs_${process.argv[5]}.env` });


module.exports = async callback => {
try{
  
      const myContract    = await MyContract.at(env.parsed.CLIENT_ADDRESS);
        let tx            = await myContract.setPermissionJobId(await web3.utils.fromAscii("842ff826bb0d4921a8fd252a78827982"));

	    console.log(`>>>>>>> SET PermissionJobId: ${myContract.address} ON NETWORK ${process.argv[5]}\ntx:${tx.tx}\n\n`);

	    let allJOBID        = await myContract.getPermissionJobId();
	    console.log(`LIST JOBID: ${allJOBID}`);

    
  
}catch(e){console.log(e);}
  callback();
}