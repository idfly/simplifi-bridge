const argv = require('minimist')(process.argv.slice(2), {string: ['stand']});

const Web3 = require('web3');
const { networks } = require('../../truffle-config');



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
   const web3Net1 = argv.stand === 'devstand' ? new Web3.providers.WebsocketProvider('ws://'+ networks[net1].host +":"+ networks[net1].port) : networks[net1].provider();
   const web3Net2 = argv.stand === 'devstand' ? new Web3.providers.WebsocketProvider('ws://'+ networks[net2].host +":"+ networks[net2].port) : networks[net2].provider();
   
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

   let amountNet1      = await ERC20Net1.web3.utils.toWei('2','Ether');
   let amountNet2      = await ERC20Net2.web3.utils.toWei('60','Ether');
   let balancePoolNet2 = await tokenPoolNet2.balanceOf(dexPoolNet2.address, {from: userNet2});

   // 1. Set approve

   await tokenPoolNet1.approve(dexPoolNet1.address, amountNet1, {from: userNet1});
   await tokenPoolNet2.approve(dexPoolNet2.address, amountNet2, {from: userNet2});

   // 2. AddLiquidity
   /*
     amountNet1      - сумма для зачисления к текущем пуле
     amountNet2      - сумма для зачисления в дургой сети пула
     userNet2        - адрес участника с которого надо сделать перевод в другой сети
     balancePoolNet2 - баланс пула в другой сети для расчета LP токенов
   */
   const tx = await dexPoolNet1.addLiquidity(amountNet1,
                                             amountNet2,
                                             userNet2,
                                             balancePoolNet2, {from: userNet1});

   console.log(JSON.stringify(tx, null, 4));

}catch(e){console.log(e);}
  callback();
}
