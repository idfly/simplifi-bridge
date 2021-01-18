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
