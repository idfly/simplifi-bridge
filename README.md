## Simplifi - liquidity defragmentation solution for heterogeneous blockchains.

The work was originally started at EthGlobal Marketmake hackathone https://github.com/digiu-ai/MarketMake 

## **Description**

The goal of our project is to create a **cross-chain*** swap between hetregenous blockchains.

## **How It's Made**

Current version of cross-chain bridge utilises decentralization in spite of using chainlink infrastructure to be hosted on. It comsumes expensive onchain adaters requests signature verification to ensure not really trusted adapter owners to process cross-chain requests

###
later we speak about versions as follows:
POC - proof pf concept version was made during ETHGlobal Marketmake
Current - current version with some decentralization features but hosted on chainlink nodes


## POC Use cases
- User can swap any Ethereum asset to pegged BSC asset of same type (for example USDT ERC20  <-> USDT BEP20)
- User can swap a token of any type from Ethereum for any existing BSC token (ETH <-> BNB ) 
- Dexpool protocol can emit new BSC asset, the collateral is proved through Chainlink ETH-to-BTC integration (asset is locked by contract on Ethereum side, proof is send throgh chainlink to BSC,  new pegged asset is emited on BSC and sent to user)



## POC Architecture

The prototype included functionality
- add **ERC20**-like asset to DexPool of any configured chain
- make "pair" of two assets not depending to what chain each of them belong
- swap assets between chains with minimum rate calculations
- developed **chainlink external adapter script** is used to  get data from external chain and change state of another chain's smart contract 
- "bidirectional" wallet is implemented on front for better user experience

### DexPool contract
DexPool is deployed to both Ethereum and Binance Smart Chain networks. The methods like **swap, withdraw, addLiquidity** are implemented to be used from native chain as well as method **reciever** is used to be called from external chain through adapter.



[comment]: <> (## Architecture Diagram)

[comment]: <> (![Architecture Diagram]&#40;./img/diagram.png&#41;)




## Architecture

current version brings decentralization into somehow centralized chainlink ecosystem. We added possibility for multiple adapter to process cross-chain request grained with security checks. Adapters register in smart contract to participate. Adaters requests are checked for convinience onchain.


## "whole picture" diagram

![Diagram](./doc/DigiUCrosschain_V2.png)

## integration diagram

![integration diagram](./doc/cross-chain-intergation-diag-V2.png)


## Prerequisites to deploy and test

- Ubuntu >= 18, truffle, docker, docker-compose


## Local tests and deployment

``
git clone https://github.com/digiu-ai/simplifi-bridge.git
yarn
yarn start
``

After this commands full local stand infrustructure will be rised up
To test transfer asset from network1 to network2 and vise versa run:

``
yarn integration-test:local
``


## Testnet test and deployment ( Rinkeby and BSC testnet)



### Deploy
``
npm run deploy:testnet
``

On Rinkeby fill Bridge.sol with Links  ( #CLIENT_ADDRESS field in addrs_rinkeby.env).
Get Link token from https://rinkeby.chain.link/

### Test

``
yarn integration-test:testnet*
``

### Troubleshooting

- check amount of chainlink by addrs_rinkeby.env #CLIENT_ADDRESS
- check amount of eth: 0x3BcB1323A245EEe08CC5aE1Bf62A1EFb2C109048, 0x13929fE14F869D6CD0717b779FF2f935B7cc65aD
- check amount of bnb: 0xFB51894A3540Be1eD5fD5155A20a379bE31Ef2cd, 0x90a3Dc8A52c11a958c67de3B671533707F6A9e82

