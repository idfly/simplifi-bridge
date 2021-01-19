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
- BSC_TESTNET_LINK_CONTRACT_ADDRESS=0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06

# NOTE
## DEFAULT_HTTP_TIMEOUT (Maximum time to wait for a response in the HTTP adapter. Default:15s)