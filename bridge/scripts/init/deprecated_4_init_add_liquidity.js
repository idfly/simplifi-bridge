const DexPool    = artifacts.require('DexPool');
const ERC20      = artifacts.require('ERC20');

let env                 = require('dotenv').config({ path: `../../build/addrs_${process.argv[5]}.env` });
const { initAddresses } = require('../../utils/helper');

module.exports = async callback => {

      let addresses = await initAddresses(process.argv[5], env);

  
      const dexPool       = await DexPool.at(addresses.POOL_ADDRESS);
      const token_pool    = await ERC20.at(addresses.TOKENPOOL_ADDRESS);
      const tx            = await token_pool.transfer(dexPool.address, await web3.utils.toWei('2','Ether'), { from: (await web3.eth.getAccounts())[0] });

      console.log(`>>>>>>> Emulate liquidity in pool: ${dexPool.address} on network ${process.argv[5]} tx:${tx.tx}`);
      console.log(`>>>>>>>>>>>>>  Balance on Pool: ${dexPool.address} is: ${(await token_pool.balanceOf(dexPool.address)).toString()} token: ${addresses.TOKENPOOL_ADDRESS}`);
  

  callback();
}