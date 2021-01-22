const DexPool    = artifacts.require('DexPool');
const ERC20      = artifacts.require('ERC20');

let env = require('dotenv').config({ path: `../../build/addrs_${process.argv[5]}.env` });

module.exports = async callback => {

  let DAI_ADDRESS             = null;

  if(process.argv[5] === 'rinkeby'){
      DAI_ADDRESS             = '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea';
  }

  if(process.argv[5] === 'binancetestnet'){
      DAI_ADDRESS             = '0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867';
  }


      const dexPool       = await DexPool.at(env.parsed.POOL1_ADDRESS);
      const dai           = await ERC20.at(DAI_ADDRESS);
      const tx            = await dai.transfer(dexPool.address, await web3.utils.toWei('2','Ether'), { from: (await web3.eth.getAccounts())[0] });

      console.log(`>>>>>>> Emulate liquidity in pool: ${dexPool.address} on network ${process.argv[5]}\ntx:${tx.tx}\n\n`);
      console.log(`>>>>>>>>>>>>>  Balance on Pool: ${dexPool.address} is: ${(await dai.balanceOf(dexPool.address)).toString()} dai`);
  

  callback();
}