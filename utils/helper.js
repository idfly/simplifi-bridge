"use strict";
const Web3 = require('web3');
const web3 = new Web3();

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

      LINK_CONTRACT_ADDRESS   = '0x56aa83FE311efAA95245bE79C21c9ca4b53774b4';
      ORACLE_CONTRACT_ADDRESS = '0xA5d6A1CE7a8ffD631170E4882BF7fe210A3945C8';
      TOKENPOOL_ADDRESS       = '0x55797e477BE468855690c660AA2640d3E9F80Cc6';

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

  }catch(e){console,log(e);}

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

module.exports = {

    writeEnv,
    initAddresses,
    toWei,
    fromWei,
    checkoutProvider,
    timeout

    
};
