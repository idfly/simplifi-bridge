const argv = require('minimist')(process.argv.slice(2), {string: ['stand']});

const Web3 = require('web3');
const { networks } = require('../../truffle-config');

const Bridge1  = artifacts.require("Bridge");
const Bridge2  = artifacts.require("Bridge");

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

   // create provider
   const web3Net1 = argv.stand === 'devstand' ? new Web3.providers.WebsocketProvider('ws://'+ networks[net1].host +":"+ networks[net1].port) : networks[net1].provider();
   const web3Net2 = argv.stand === 'devstand' ? new Web3.providers.WebsocketProvider('ws://'+ networks[net2].host +":"+ networks[net2].port) : networks[net2].provider();
   
   Bridge1.setProvider(web3Net1);
   Bridge2.setProvider(web3Net2);

   let myContract1 = await Bridge1.at(envNet1.parsed.CLIENT_ADDRESS);
   let myContract2 = await Bridge2.at(envNet2.parsed.CLIENT_ADDRESS);

   const userNet1 = (await Bridge1.web3.eth.getAccounts())[0];
   const userNet2 = (await Bridge2.web3.eth.getAccounts())[0];

   /** fill whitelist for signers(adapter chainlink) */

   let res3 = await myContract1.setControl('0x2b3cc5fcAC62299520FA96D75f125c33B48E70d7', {from: userNet1});
   console.log('myContract3.setControl: ',res3.tx);
   let res4 = await myContract1.setControl('0x719EF299C8900bF8D53c25cA5a30C86433E506B6', {from: userNet1});
   console.log('myContract4.setControl: ',res4.tx);

   let res5 = await myContract2.setControl('0x23a0d8DbDA10A9d4a9a08Ab26f52bC4EaeE41f89', {from: userNet2});
   console.log('myContract5.setControl: ',res5.tx);
   let res6 = await myContract2.setControl('0x201a64752792288D8F1d4697B778c916Bd3c4a8F', {from: userNet2});
   console.log('myContract6.setControl: ',res6.tx);


}catch(e){console.log(e);}
  callback();
}
