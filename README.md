# DExPool

## Deploy (currently on local stand)

### Prerequisites

 - docker
 - docker-compose

- clone repo install and start
````
npm start
````

## Test by hands on LOCAL STAND (convenient for debug)


- deploy all 
```bash
npm start
```

- checks pools balances
```bash
truffle exec ./scripts/init/CHECK_RESULT.js --stand devstand
```

- add liquidity on pools
```bash
truffle exec ./scripts/init/4_add_liquidity.js --stand devstand
truffle exec ./scripts/init/CHECK_RESULT.js --stand devstand
```

- swap deposit
```bash
truffle exec ./scripts/init/5_swap_deposit.js --network network1 --recipient 0xdcAddcd4206448DceEF19aeeF5f6a4355c3301C4 # on over side
truffle exec ./scripts/init/CHECK_RESULT.js --stand devstand
```


# Binance Testnet

- ETH_URL=ws://95.217.104.54:8576
- CHAINLINK_NODE=http://168.119.111.104:6688/

# Rinkeby testnet

- cd ~/.chainlink-rinkeby && docker run -d --network host  -p 6688:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink:0.9.8 local n -p  chainlink/chainlink.pwd -a /chainlink/api.pwd

- ETH_URL=wss://rinkeby.infura.io/ws/v3/b9e220845c084e9195c77c542a852dd7
- CHAINLINK_NODE=http://135.181.146.147:6688

## LOGIN PASSWORD CHAINLINK NODE

- Login: alekcangp@list.ru
- Pass: 55555555


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
- docker-compose -f ./testnet-docker-compose.yaml up -d adapter1_net


