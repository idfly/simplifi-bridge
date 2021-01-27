const argv = require('minimist')(process.argv.slice(2), {string: ['stand']});

const Web3 = require('web3');
const { networks } = require('../../truffle-config');
const { toWei, fromWei } = require('../../utils/helper');


const DexPoolNet1  = artifacts.require("DexPool");
const DexPoolNet2  = artifacts.require("DexPool");
const ERC20Net1    = artifacts.require('ERC20');
const ERC20Net2    = artifacts.require('ERC20');

// определяем на каком стенде мы стартуем (стенд разработки или тестнет стенд)
let net1 = argv.stand === 'devstand' ? 'network1' : argv.stand === 'teststand' ? 'rinkeby' : (function(){throw "unresolved value of --network"}());
let net2 = argv.stand === 'devstand' ? 'network2' : argv.stand === 'teststand' ? 'binancetestnet' : (function(){throw "unresolved value of --network"}());
// получаем переменные среды обоих сетей
let envNet1 = require('dotenv').config({ path: `../../build/addrs_${net1}.env` });
let envNet2 = require('dotenv').config({ path: `../../build/addrs_${net2}.env` });



module.exports = async callback => {
try{

   // создаем провайдера
   const web3Net1 = new Web3.providers.WebsocketProvider('ws://'+ networks[net1].host +":"+ networks[net1].port);
   const web3Net2 = new Web3.providers.WebsocketProvider('ws://'+ networks[net2].host +":"+ networks[net2].port);
   
   DexPoolNet1.setProvider(web3Net1);
   DexPoolNet2.setProvider(web3Net2);
   ERC20Net1.setProvider(web3Net1);
   ERC20Net2.setProvider(web3Net2);


   let dexPoolNet1 = await DexPoolNet1.at(envNet1.parsed.POOL_ADDRESS);
   let dexPoolNet2 = await DexPoolNet2.at(envNet2.parsed.POOL_ADDRESS);

   let tokenPoolNet1 = await ERC20Net1.at(envNet1.parsed.TOKENPOOL_ADDRESS);
   let tokenPoolNet2 = await ERC20Net2.at(envNet2.parsed.TOKENPOOL_ADDRESS);

   const userNet1 = (await DexPoolNet1.web3.eth.getAccounts())[0];
   const userNet2 = (await DexPoolNet2.web3.eth.getAccounts())[0];

   
   console.table([{
   	'Pool Name': net1,
    'Address Pool': dexPoolNet1.address,
    'Balance Pool': fromWei(await tokenPoolNet1.balanceOf(dexPoolNet1.address)),
    'User Address': userNet1,
    'User Balance': fromWei(await tokenPoolNet1.balanceOf(userNet1)),
    'User LP TOKEN Balance': fromWei(await dexPoolNet1.balanceOf(userNet1))
  },
  {
  	'Pool Name': net2,
  	'Address Pool': dexPoolNet2.address,
    'Balance Pool': fromWei(await tokenPoolNet2.balanceOf(dexPoolNet2.address)),
    'User Address': userNet2,
    'User Balance': fromWei(await tokenPoolNet2.balanceOf(userNet2)),
    'User LP TOKEN Balance': '-'
  }])

}catch(e){console.log(e);}
  callback();
}
