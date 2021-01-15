"use strict";

const fs = require('fs');
const path = require('path');

/**
   Add address under certain network
*/
const writeEnv = async (linkToken, oracle, client_address, network = 'network1') => {

    let cl_address_name = 'CLIENT1_ADDRESS';
    if(network === 'network2') cl_address_name = 'CLIENT2_ADDRESS';

    const addrFile = path.join(__dirname, '..', 'build', 'addrs_'+network+'.env');
      try {
        fs.unlinkSync(addrFile);
      } catch {
        // delete if exists; ignore errors
      }

      
      fs.writeFileSync(addrFile, `LINK_CONTRACT_ADDRESS=${linkToken}\nORACLE_CONTRACT_ADDRESS=${oracle}\n${cl_address_name}=${client_address}\n`);

  }

module.exports = {

    writeEnv
    
};
