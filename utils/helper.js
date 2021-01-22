"use strict";

const fs = require('fs');
const path = require('path');

const writeEnv = async (linkToken, oracle, client_address, pool_address, network = 'network1') => {

    const addrFile = path.join(__dirname, '..', 'build', 'addrs_'+network+'.env');

    let pool = ['network1','rinkeby'].includes(network) ? 'POOL1_ADDRESS' : ['network2','binancetestnet'].includes(network) ? 'POOL2_ADDRESS' : '';
    
      try {
        fs.unlinkSync(addrFile);
      } catch {
        // delete if exists; ignore errors
      }
  
      fs.writeFileSync(addrFile, `LINK_CONTRACT_ADDRESS=${linkToken}\nORACLE_CONTRACT_ADDRESS=${oracle}\nCLIENT_ADDRESS=${client_address}\n${pool}=${pool_address}\n`);

  }

module.exports = {

    writeEnv
    
};
