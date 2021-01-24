const DexPool    = artifacts.require('DexPool');
const ERC20      = artifacts.require('ERC20');

let env                 = require('dotenv').config({ path: `../../build/addrs_${process.argv[5]}.env` });
const { initAddresses } = require('../../utils/helper');

module.exports = async callback => {
try{

  let addresses = await initAddresses(process.argv[5], env);

 /* let DAI_ADDRESS             = null;
  let POOL_ADDRESS            = null;

  if(process.argv[5] === 'rinkeby'){
      DAI_ADDRESS             = '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea';
      POOL_ADDRESS            = env.parsed.POOL1_ADDRESS;
  }

  if(process.argv[5] === 'binancetestnet'){
      DAI_ADDRESS             = '0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867';
      POOL_ADDRESS            = env.parsed.POOL2_ADDRESS;
  }*/
//let recipent_overside = "0x8bf378473307127be9658CD91435c43D3D5c441e"; // net2
let recipent_overside = "0xc55Dd32D8A31701325fD3c2d1ABbD316E9FEA0dE"; // net1


      const dexPool       = await DexPool.at(addresses.POOL_ADDRESS);
      const token_pool    = await ERC20.at(addresses.TOKENPOOL_ADDRESS);
//                            await token_pool.approve(dexPool.address, await web3.utils.toWei('1','Ether'));

const user = (await web3.eth.getAccounts())[0];

//console.log(`>    Balance on Pool: ${dexPool.address} is: ${(await token_pool.balanceOf(dexPool.address)).toString()} token_pool: ${addresses.TOKENPOOL_ADDRESS}`);
//console.log(`>>>  Balance user: ${user} is: ${(await token_pool.balanceOf(user)).toString()} token_pool`);                            

//      const tx            = await dexPool.swapDeposit(await web3.utils.toWei('1','Ether'), recipent_overside);
      
//      console.log(`>>>>>>> swapDeposit: ${dexPool.address} on network ${process.argv[5]} tx:${tx.tx}`);
      console.log(`>>>>>>>>>>>>>  Balance on Pool: ${dexPool.address} is: ${(await token_pool.balanceOf(dexPool.address)).toString()} token_pool : ${addresses.TOKENPOOL_ADDRESS}`);
      console.log(`>>>>>>>>>>>>>>>>>>>  Balance user: ${user} is: ${(await token_pool.balanceOf(user)).toString()} token: ${addresses.TOKENPOOL_ADDRESS}`);
  
}catch(e){console,log(e);}

  callback();
}

//8b4c9fd066c141e2ad4931bc5533b3d3