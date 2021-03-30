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
       provider: () => new HDWalletProvider(process.env.SK, `ws://95.217.104.54:8576`)
    },
    rinkeby: {
       //provider: () => new HDWalletProvider(process.env.SK, `wss://rinkeby.infura.io/ws/v3/0f4453c71dd145c6b819bbbf60a96e9d`)
       //provider: () => new HDWalletProvider(process.env.SK, `wss://rinkeby.infura.io/ws/v3/ab95bf9f6dd743e6a8526579b76fe358`)
       provider: () => new HDWalletProvider(process.env.SK, `wss://rinkeby.infura.io/ws/v3/1f520f603c094850aafcb11291818e29`)
    }  
    
  }
}