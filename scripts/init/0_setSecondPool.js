const argv = require('minimist')(process.argv.slice(2), {string: ['stand']});

const Web3 = require('web3');
const { networks } = require('../../truffle-config');



const DexPoolNet1  = artifacts.require("DexPool");
const DexPoolNet2  = artifacts.require("DexPool");
const MyContract1  = artifacts.require("MyContract");
const MyContract2  = artifacts.require("MyContract");

// определяем на каком стенде мы стартуем (стенд разработки или тестнет стенд)
let net1 = argv.stand === 'devstand' ? 'network1' : argv.stand === 'teststand' ? 'rinkeby' : (function(){throw "unresolved value of --network"}());
let net2 = argv.stand === 'devstand' ? 'network2' : argv.stand === 'teststand' ? 'binancetestnet' : (function(){throw "unresolved value of --network"}());
// получаем переменные среды обоих сетей
let envNet1 = require('dotenv').config({ path: `../../build/addrs_${net1}.env` });
let envNet2 = require('dotenv').config({ path: `../../build/addrs_${net2}.env` });

let adapterAddreses = require('dotenv').config({ path: `../../adapter/adapterdgu/.env` });


/**
   - setSecondPool -  Bind second part pool address for checks
   - setControl    -  filling white list, consisting from signers
*/
module.exports = async callback => {
try{

   // создаем провайдера
   const web3Net1 = argv.stand === 'devstand' ? new Web3.providers.WebsocketProvider('ws://'+ networks[net1].host +":"+ networks[net1].port) : networks[net1].provider();
   const web3Net2 = argv.stand === 'devstand' ? new Web3.providers.WebsocketProvider('ws://'+ networks[net2].host +":"+ networks[net2].port) : networks[net2].provider();
   
   DexPoolNet1.setProvider(web3Net1);
   DexPoolNet2.setProvider(web3Net2);
   MyContract1.setProvider(web3Net1);
   MyContract2.setProvider(web3Net2);

   let dexPoolNet1 = await DexPoolNet1.at(envNet1.parsed.POOL_ADDRESS);
   let dexPoolNet2 = await DexPoolNet2.at(envNet2.parsed.POOL_ADDRESS);

   let myContract1 = await MyContract1.at(envNet1.parsed.CLIENT_ADDRESS);
   let myContract2 = await MyContract2.at(envNet2.parsed.CLIENT_ADDRESS);

   const userNet1 = (await DexPoolNet1.web3.eth.getAccounts())[0];
   const userNet2 = (await DexPoolNet2.web3.eth.getAccounts())[0];

   /** Bind other address pool for checks*/
   let res1 = await dexPoolNet1.setSecondPool(dexPoolNet2.address, {from: userNet1});
   console.log('dexPoolNet1 setSecondPool: ',res1.tx);

   /** Bind other address pool for checks*/
   let res2 = await dexPoolNet2.setSecondPool(dexPoolNet1.address, {from: userNet2});
   console.log('dexPoolNet2 setSecondPool: ',res2.tx);

   /** fill white list for signers */

   let res3 = await myContract1.setControl((await DexPoolNet2.web3.eth.getAccounts())[4+3], {from: userNet1});
   console.log('myContract3.setControl: ',res3.tx);
   let res4 = await myContract1.setControl((await DexPoolNet2.web3.eth.getAccounts())[5+3], {from: userNet1});
   console.log('myContract4.setControl: ',res4.tx);

   let res5 = await myContract2.setControl((await DexPoolNet1.web3.eth.getAccounts())[4+3], {from: userNet2});
   console.log('myContract5.setControl: ',res5.tx);
   let res6 = await myContract2.setControl((await DexPoolNet1.web3.eth.getAccounts())[5+3], {from: userNet2});
   console.log('myContract6.setControl: ',res6.tx);


}catch(e){console.log(e);}
  callback();
}
