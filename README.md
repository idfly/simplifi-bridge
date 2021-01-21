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

#  НЕЗАБУДЬ ПОСЛЕ КАЖДОГО ПЕРЕДЕПЛОЯ СМАРТОВ МЕНЯЮТСЯ АДРЕСА ПУЛА И ОРАКУЛА НО В КОНТЕЙНЕР АДАПТЕРА НИКАК ПОКА `НЕ ПЕРЕДАЮТСЯ !!!!`

# ADDRESES

- BSC_MAINNET_LINK_CONTRACT_ADDRESS=0x404460C6A5EdE2D891e8297795264fDe62ADBB75

## Binance Testnet

- PORT=8082
- ETH_URL=ws://95.217.104.54:8576
- ORACLE_CONTRACT_ADDRESS=
- POOL_ADDRESS=


- CHAINLINK_NODE=http://168.119.111.104:6688/
- BSC_TESTNET_LINK_CONTRACT_ADDRESS=0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06


## Rinkeby testnet

- PORT=8082
- ETH_URL=wss://rinkeby.infura.io/ws/v3/b9e220845c084e9195c77c542a852dd7
- ORACLE_CONTRACT_ADDRESS=
- POOL_ADDRESS=

- LINK_CONTRACT_ADDRESS=0x01BE23585060835E02B77ef475b0Cc51aA1e0709
- CHAINLINK_NODE=http://135.181.146.147:6688


## LOGIN PASSWORD CHAINLINK NODE

- Login: alekcangp@list.ru
- Pass: 55555555

# NOTE
## DEFAULT_HTTP_TIMEOUT (Maximum time to wait for a response in the HTTP adapter. Default:15s)