# Digiu.labs

## Deploy


```bash
$ cd project
$ npm install
$ truffle exec './scripts/prep-node.js' --network network1
$ truffle exec './scripts/prep-node.js' --network network2
$ truffle exec './scripts/fund-client.js' --network network1
$ truffle exec './scripts/fund-client.js' --network network2
$ truffle exec './scripts/jobID.js' --network network1  (после как получили)

```


## Test

```bash
$ truffle exec './scripts/z_test.js' --network network1  (пока так)
```


# ADDRESES

- BSC_MAINNET_LINK_CONTRACT_ADDRESS=

## Binance Testnet




## Rinkeby testnet

- cd ~/.chainlink-rinkeby && docker run -d --network host  -p 6688:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink:0.9.8 local n -p  chainlink/chainlink.pwd -a /chainlink/api.pwd
- https://rinkeby.chain.link/

- PORT=8082
- ETH_URL=wss://rinkeby.infura.io/ws/v3/b9e220845c084e9195c77c542a852dd7
- ORACLE_CONTRACT_ADDRESS=
- POOL_ADDRESS=




# ENV FOR ADAPTER

### env for connect to network2
- PORT=8081
- LISTEN_NETWORK=network1 # network2 binancetestnet rinkeby - эту сеть будем слушать (ex: адатер ethereum'a будет слушать binance)
- POOL_ADDRESS=0xfc7d7De344a05b96B93758723582c24D6369E877  # - эти адреса будем слушать (адреса противоположной сети)
- ORACLE_CONTRACT_ADDRESS=0x267AD41c1810074E8b37317c3e90a516d3be910F # - эти адреса будем слушать (адреса противоположной сети)


# NOTE
## DEFAULT_HTTP_TIMEOUT (Maximum time to wait for a response in the HTTP adapter. Default:15s)


# ADDRESS OWNER

### RINKEBY

- 0x9805E1FD9013f79b04F6cED13696F9346b70cC39
- https://rinkeby.etherscan.io/

### BINANCE TESTNET

- 0x6cd6797154b7e64855bAbDB660197a4C56354518
- https://testnet.bscscan.com/




# TEST BY HANDS

- npm start
- truffle exec ./scripts/init/1_set_jobId.js --network network1  // указать актуальный jobid
- truffle exec ./scripts/init/1_set_jobId.js --network network2  // указать актуальный jobid
- truffle exec ./scripts/init/CHECK_RESULT.js --stand devstand
- truffle exec ./scripts/init/4_add_liquidity.js --stand devstand // указать актуальное количество токенов
- truffle exec ./scripts/init/CHECK_RESULT.js --stand devstand
- truffle exec ./scripts/init/5_swap_deposit.js --network network1  // указать адрес получателя в другой сети
- truffle exec ./scripts/init/CHECK_RESULT.js --stand devstand

