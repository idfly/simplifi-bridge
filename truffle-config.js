require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  networks: {

    network1: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "1337",
    },

    network2: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "1337",
    },

    binancetestnet: {
       provider: () => new HDWalletProvider(process.env.MNEMONIC_TESTNET_BSC, `https://data-seed-prebsc-1-s1.binance.org:8545/`),
       network_id: 97,
       timeoutBlocks: 200  
    },
    rinkeby: {
       provider: () => new HDWalletProvider(process.env.MNEMONIC_TESTNET_RINKEBY, `wss://rinkeby.infura.io/ws/v3/b9e220845c084e9195c77c542a852dd7`),
       network_id: 4,
       timeoutBlocks: 200  
    }  
    
  },
  compilers: {
    solc: {
       version: "0.6.9",    
       docker: true,   
       parser: "solcjs",
       settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
        //evmVersion: "byzantium"
      }
    }
  }
}
