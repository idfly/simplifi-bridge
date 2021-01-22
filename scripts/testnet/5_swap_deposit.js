const DexPool    = artifacts.require('DexPool');
const ERC20      = artifacts.require('ERC20');

let env = require('dotenv').config({ path: `../../build/addrs_${process.argv[5]}.env` });

module.exports = async callback => {
try{
  let DAI_ADDRESS             = null;
  let POOL_ADDRESS            = null;

  if(process.argv[5] === 'rinkeby'){
      DAI_ADDRESS             = '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea';
      POOL_ADDRESS            = env.parsed.POOL1_ADDRESS;
  }

  if(process.argv[5] === 'binancetestnet'){
      DAI_ADDRESS             = '0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867';
      POOL_ADDRESS            = env.parsed.POOL2_ADDRESS;
  }


      const dexPool       = await DexPool.at(POOL_ADDRESS);
      const dai           = await ERC20.at(DAI_ADDRESS);
                            await dai.approve(dexPool.address, await web3.utils.toWei('1','Ether'));
      const tx            = await dexPool.swapDeposit(await web3.utils.toWei('1','Ether'), (await web3.eth.getAccounts())[1]);
      
      const user = (await web3.eth.getAccounts())[0];

      console.log(`>    Balance on Pool: ${dexPool.address} is: ${(await dai.balanceOf(dexPool.address)).toString()} dai`);
      console.log(`>>>  Balance user: ${user} is: ${(await dai.balanceOf(user)).toString()} dai`);
      console.log(`>>>>>>> swapDeposit: ${dexPool.address} on network ${process.argv[5]} tx:${tx.tx}`);
      console.log(`>>>>>>>>>>>>>  Balance on Pool: ${dexPool.address} is: ${(await dai.balanceOf(dexPool.address)).toString()} dai`);
      console.log(`>>>>>>>>>>>>>>>>>>>  Balance user: ${user} is: ${(await dai.balanceOf(user)).toString()} dai`);
  
}catch(e){console,log(e);}

  callback();
}

//8b4c9fd066c141e2ad4931bc5533b3d3