# ADDRESES

- BSC_MAINNET_LINK_CONTRACT_ADDRESS=

## Binance Testnet

- PORT=8081
- ETH_URL=ws://95.217.104.54:8576
- ORACLE_CONTRACT_ADDRESS=
- POOL_ADDRESS=


- CHAINLINK_NODE=http://168.119.111.104:6688/
- BSC_TESTNET_LINK_CONTRACT_ADDRESS=


## Rinkeby testnet

- cd ~/.chainlink-rinkeby && docker run -d --network host  -p 6688:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink:0.9.8 local n -p  chainlink/chainlink.pwd -a /chainlink/api.pwd
- https://rinkeby.chain.link/

- PORT=8082
- ETH_URL=wss://rinkeby.infura.io/ws/v3/b9e220845c084e9195c77c542a852dd7
- ORACLE_CONTRACT_ADDRESS=
- POOL_ADDRESS=

- LINK_CONTRACT_ADDRESS=
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
