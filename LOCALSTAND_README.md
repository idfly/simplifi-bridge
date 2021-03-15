# DExPool

## Deploy (currently on local stand)

### Prerequisites

 - docker
 - docker-compose

- clone repo install and start
````
npm start
````

## Integration test

- deploy all 
```bash
npm start
```

- execute test
```bash
npm run integration:local
```


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
