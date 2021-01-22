const DexPool    = artifacts.require('DexPool')
const MyContract = artifacts.require('MyContract')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');


let env = require('dotenv').config({ path: `../../build/addrs_${process.argv[5]}.env` });


module.exports = async callback => {
try{
  
      const myContract    = await MyContract.at(env.parsed.CLIENT_ADDRESS);
      const tx            = await myContract.setJobID(await web3.utils.fromAscii("8b4c9fd066c141e2ad4931bc5533b3d3"));    
      
      console.log(`>>>>>>> SET JOBID: ${myContract.address} ON NETWORK ${process.argv[5]}\ntx:${tx.tx}\n\n`);
    
  
}catch(e){console.log(e);}
  callback();
}
