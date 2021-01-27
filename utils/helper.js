"use strict";
const Web3 = require('web3');
const web3 = new Web3();

const fs = require('fs');
const path = require('path');

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
      TOKENPOOL_ADDRESS       = '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea';

  }

  if(network === 'binancetestnet'){

      LINK_CONTRACT_ADDRESS   = '0x88e69c0d2d924e642965f8dd151dd2e24ba154f8';
      ORACLE_CONTRACT_ADDRESS = '0x8c7864014b78b7126d2d5a01f604b5af910441bc';
      TOKENPOOL_ADDRESS       = '0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867';

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

module.exports = {

    writeEnv,
    initAddresses,
    toWei,
    fromWei
    
};
