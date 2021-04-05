"use strict";
const Web3 = require('web3');
const web3 = new Web3();
const axios = require('axios');

const fs = require('fs');
const path = require('path');
const { networks }         = require('../truffle-config');

function toWei(n) { return web3.utils.toWei(n, 'ether');}
function fromWei(n) { return web3.utils.fromWei(n, 'ether');}

const writeEnv = async (linkToken, oracle, client_address, pool_address, tokenpool, network = 'network1') => {

    const addrFile = path.join(__dirname, '..', 'build', 'addrs_'+network+'.env');
    
      try {
        fs.unlinkSync(addrFile);
      } catch {
        // delete if exists; ignore errors
      }
  
      fs.writeFileSync(addrFile, `LINK_CONTRACT_ADDRESS=${linkToken}\nORACLE_CONTRACT_ADDRESS=${oracle}\nCLIENT_ADDRESS=${client_address}\nPOOL_ADDRESS=${pool_address}\nTOKENPOOL_ADDRESS=${tokenpool}\n`);

  }

const initAddresses = async (network, env) => {

try{
      let LINK_CONTRACT_ADDRESS   = null;
      let ORACLE_CONTRACT_ADDRESS = null;
      let TOKENPOOL_ADDRESS       = null;
      let POOL_ADDRESS            = env !== null ? env.parsed.POOL_ADDRESS : '0x0000000000000000000000000000000000000000';
      

  if(network === 'rinkeby'){

      LINK_CONTRACT_ADDRESS   = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';
      ORACLE_CONTRACT_ADDRESS = '0x09008c3049784eD132bd076C083ad44091C9e55b';
      TOKENPOOL_ADDRESS       = '0x918809f0c1d4c5e56328742406ddbf6bf7807c73';

  }

  if(network === 'binancetestnet'){

      LINK_CONTRACT_ADDRESS   = env.parsed.LINK_CONTRACT_ADDRESS;
      ORACLE_CONTRACT_ADDRESS = env.parsed.ORACLE_CONTRACT_ADDRESS;
      TOKENPOOL_ADDRESS       = env.parsed.TOKENPOOL_ADDRESS;

  }

  if(network === 'network1' || network === 'network2'){

      LINK_CONTRACT_ADDRESS   = env.parsed.LINK_CONTRACT_ADDRESS;
      ORACLE_CONTRACT_ADDRESS = env.parsed.ORACLE_CONTRACT_ADDRESS;
      TOKENPOOL_ADDRESS       = env.parsed.TOKENPOOL_ADDRESS;

  }

  let res = {
      LINK_CONTRACT_ADDRESS: LINK_CONTRACT_ADDRESS,   
      ORACLE_CONTRACT_ADDRESS: ORACLE_CONTRACT_ADDRESS, 
      TOKENPOOL_ADDRESS: TOKENPOOL_ADDRESS,
      POOL_ADDRESS: POOL_ADDRESS
  }

  return res;

  }catch(e){console.log(e);}

}

const checkoutProvider = (argv) => {

  if(argv.typenet === 'devstand'){

    const web3Net1 = new Web3.providers.WebsocketProvider('ws://'+ networks[argv.net1].host +":"+ networks[argv.net1].port);
    const web3Net2 = new Web3.providers.WebsocketProvider('ws://'+ networks[argv.net2].host +":"+ networks[argv.net2].port);

    return {web3Net1, web3Net2};
  }

  if(argv.typenet === 'teststand'){

    const web3Net1 = networks[argv.net1].provider();
    const web3Net2 = networks[argv.net2].provider();

    return {web3Net1, web3Net2};
  }
}

const timeout = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
}

const adapters = () => {
  return { 
            "adapter1_net1_1": "0xFB51894A3540Be1eD5fD5155A20a379bE31Ef2cd",
            "adapter2_net1_1": "0x90a3Dc8A52c11a958c67de3B671533707F6A9e82",
            "adapter1_net2_1": "0x13929fE14F869D6CD0717b779FF2f935B7cc65aD",
            "adapter2_net2_1": "0x3BcB1323A245EEe08CC5aE1Bf62A1EFb2C109048"
         }
}


const checkBlock = async (web3, addr) => {
  try{
    let block = await web3.eth.getBlock('latest');
    let number = block.number;
    let transactions = block.transactions;
    let h = true;
    while(h){
      if (block != null && block.transactions != null) {
          for (let txHash of block.transactions) {
              let tx = await web3.eth.getTransaction(txHash);
              if (addr.toLowerCase() == tx.from.toLowerCase()) {
                   
                  return txHash;
              }
          }
      }
      block = await web3.eth.getBlock(block.number - 1);
    }
  }catch(e){console.log('catch unsolved bug'); return null;}  
}

const getCostFromScan = async (netwk, tx) => {
  try{
    let response = null;
    let from     = null;

    let w = netwk === 'rinkeby' ? `https://rinkeby.etherscan.io/tx/${tx}` : `https://testnet.bscscan.com/tx/${tx}`;

      while(true){
       response = await axios.get(w);
       from     = response.data.search('The amount of GAS used by this specific transaction alone');
       if(from !== -1) break; // the web site was updated
       await timeout(500);
      }
    from = response.data.substring(from);
    let cut  = from.search(' \\(');
      
    console.log(from.substring(0, cut).replace('" data-toggle="tooltip">',': '));

  }catch(e){ console.log(e);}
}



module.exports = {

    writeEnv,
    initAddresses,
    toWei,
    fromWei,
    checkoutProvider,
    timeout,
    adapters,
    checkBlock,
    getCostFromScan

    
};
