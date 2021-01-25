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

- PORT=8081
- ETH_URL=ws://95.217.104.54:8576
- ORACLE_CONTRACT_ADDRESS=0x8c7864014b78b7126d2d5a01f604b5af910441bc
- POOL_ADDRESS=


- CHAINLINK_NODE=http://168.119.111.104:6688/
- BSC_TESTNET_LINK_CONTRACT_ADDRESS=0x88e69c0d2d924e642965f8dd151dd2e24ba154f8


## Rinkeby testnet

- https://rinkeby.chain.link/

- PORT=8082
- ETH_URL=wss://rinkeby.infura.io/ws/v3/b9e220845c084e9195c77c542a852dd7
- ORACLE_CONTRACT_ADDRESS=0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e
- POOL_ADDRESS=

- LINK_CONTRACT_ADDRESS=0x01BE23585060835E02B77ef475b0Cc51aA1e0709
- CHAINLINK_NODE=http://135.181.146.147:6688


## LOGIN PASSWORD CHAINLINK NODE

- Login: alekcangp@list.ru
- Pass: 55555555


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


- scp ./digiulab.tar.gz ubuntu@168.119.111.104:/home/ubuntu/git
- scp ./digiulab.tar.gz ubuntu@135.181.146.147:/home/ubuntu/git
- tar czf digiulab.tar.gz ./digiu.lab
- tar -xzf digiulab.tar.gz
-  docker-compose -f ./testnet-docker-compose.yaml up -d adapter1_net