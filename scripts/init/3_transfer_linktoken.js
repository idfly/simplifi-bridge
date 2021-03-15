const MyContract    = artifacts.require('MyContract')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');
const { Oracle }    = require('@chainlink/contracts/truffle/v0.6/Oracle');

let env                 = require('dotenv').config({ path: `../../build/addrs_${process.argv[5]}.env` });
const { initAddresses } = require('../../utils/helper');



module.exports = async callback => {
try{
  LinkToken.setProvider(web3.currentProvider);
  Oracle.setProvider(web3.currentProvider);
  
  let addresses = await initAddresses(process.argv[5], env);



      const myContract    = await MyContract.at(env.parsed.CLIENT_ADDRESS);
      const token         = await LinkToken.at(addresses.LINK_CONTRACT_ADDRESS);
      const tx            = await token.transfer(myContract.address, await web3.utils.toWei('100','Ether'), { from: (await web3.eth.getAccounts())[0] });

      console.log(`>>>>>>> TRANSFER LINK TOKEN TO MyContract: ${myContract.address} ON NETWORK ${process.argv[5]}\ntx:${tx.tx}\n\n`);
      console.log(`>>>>>>>>>>>>>  Balance MyContract: ${myContract.address} is: ${(await token.balanceOf(myContract.address)).toString()} LINK`);
  
}catch(e){console.log(e);}
  callback();
}
