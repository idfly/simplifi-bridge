const DexPool    = artifacts.require('DexPool');
const ERC20      = artifacts.require('ERC20');

let env                 = require('dotenv').config({ path: `../../build/addrs_${process.argv[5]}.env` });
const { initAddresses } = require('../../utils/helper');

module.exports = async callback => {
try{

let addresses = await initAddresses(process.argv[5], env);

let recipent_overside = "0x8bf378473307127be9658CD91435c43D3D5c441e"; // net2
//let recipent_overside = "0xc55Dd32D8A31701325fD3c2d1ABbD316E9FEA0dE"; // net1


      const dexPool       = await DexPool.at(addresses.POOL_ADDRESS);
      const token_pool    = await ERC20.at(addresses.TOKENPOOL_ADDRESS);
                            await token_pool.approve(dexPool.address, await web3.utils.toWei('1','Ether'));

const user = (await web3.eth.getAccounts())[0];

      const tx            = await dexPool.swapDeposit(await web3.utils.toWei('1','Ether'), recipent_overside);
      console.log(`Network ${process.argv[5]} tx:${tx.tx}`);

  
}catch(e){console,log(e);}

  callback();
}

//8b4c9fd066c141e2ad4931bc5533b3d3