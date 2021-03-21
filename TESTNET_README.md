## PREREQUISITES

- Ubuntu >= 18, truffle, docker, docker-compose

## DEPLOY
- *npm run deploy:testnet*
- `ONLY RINKEBY` fill to Bridge.sol (addrs_rinkeby.env#CLIENT_ADDRESS) chainlink token from https://rinkeby.chain.link/

## TEST
- *npm run integration-test:testnet*

### TROUBLESHOOTING

- check amount of chainlink by addrs_rinkeby.env#CLIENT_ADDRESS
- check amount of eth: 0x3BcB1323A245EEe08CC5aE1Bf62A1EFb2C109048, 0x13929fE14F869D6CD0717b779FF2f935B7cc65aD
- check amount of bnb: 0xFB51894A3540Be1eD5fD5155A20a379bE31Ef2cd, 0x90a3Dc8A52c11a958c67de3B671533707F6A9e82


## CHEAT SHEETS

### Binance Testnet

- CHAINLINK_NODE=http://168.119.111.104:6688/

### Rinkeby testnet

- cd ~/.chainlink-rinkeby && docker run -d --network host  -p 6688:6688 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink:0.9.8 local n -p  chainlink/chainlink.pwd -a /chainlink/api.pwd
- https://rinkeby.chain.link/

### LOGIN PASSWORD CHAINLINK NODE

- Login: alekcangp@list.ru
- Pass: 55555555

## NOTE
### DEFAULT_HTTP_TIMEOUT (Maximum time to wait for a response in the HTTP adapter. Default:15s)


- scp ./digiulab.tar.gz ubuntu@168.119.111.104:/home/ubuntu/git
- scp ./digiulab.tar.gz ubuntu@135.181.146.147:/home/ubuntu/git
- tar czf digiulab.tar.gz ./digiu.lab
- tar -xzf digiulab.tar.gz
-  docker-compose -f ./testnet-docker-compose.yaml up -d adapter1_net
