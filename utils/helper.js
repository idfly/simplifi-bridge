"use strict";

const fs = require('fs');
const path = require('path');

/**
   Add address under certain network
*/
const writeEnv = async (linkToken, oracle, network = 'network1') => {

    
    const addrFile = path.join(__dirname, '..', 'build', 'addrs_'+network+'.env');
      try {
        fs.unlinkSync(addrFile);
      } catch {
        // delete if exists; ignore errors
      }

      fs.writeFileSync(addrFile, `LINK_CONTRACT_ADDRESS=${linkToken}\nORACLE_CONTRACT_ADDRESS=${oracle}\n`);

  }

module.exports = {

    writeEnv
    
};
