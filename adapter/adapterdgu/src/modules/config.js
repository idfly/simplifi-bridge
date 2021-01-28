const HDWalletProvider = require('@truffle/hdwallet-provider')
//process.env.MNEMONIC_TESTNET_BS =;
module.exports = {
  networks: {

    network1: {
     host: "172.20.128.11",
     port: 7545,
     network_id: "1337",
    },

    network2: {
     host: "172.20.128.12",
     port: 8545,
     network_id: "1337",
    },

    binancetestnet: {
       provider: () => new HDWalletProvider("city detect lawn theory regular leisure hire solid mansion inflict expire aerobic", `https://data-seed-prebsc-1-s1.binance.org:8545/`)
    },
    rinkeby: {
       provider: () => new HDWalletProvider('city detect lawn theory regular leisure hire solid mansion inflict aerobic expire', `wss://rinkeby.infura.io/ws/v3/b9e220845c084e9195c77c542a852dd7`)
    }  
    
  }
}