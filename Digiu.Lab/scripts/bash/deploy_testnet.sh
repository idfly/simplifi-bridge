#!/usr/bin/env bash

docker-compose -f ./testnet-docker-compose.yaml stop && docker-compose -f ./testnet-docker-compose.yaml rm && rm -rf build/contracts && \
sudo rm -rf /var/lib/postgres/network2 && sudo rm -rf /var/lib/postgres/network1 && \
npx truffle migrate --reset --network rinkeby && npx truffle migrate --reset --network binancetestnet && \
docker-compose -f ./testnet-docker-compose.yaml up -d && docker-compose -f ./testnet-docker-compose.yaml ps && \
npx truffle exec './scripts/init/0_setSecondPool.js' --stand teststand && \
npx truffle exec ./scripts/init/3_transfer_linktoken.js --network binancetestnet && \
#npx truffle exec ./scripts/init/2_only_dev_stand.js --network rinkeby && \
#npx truffle exec ./scripts/init/2_only_dev_stand.js --network binancetestnet
./scripts/bash/1_add_bridge.sh  http://localhost:6688 http://172.20.128.58:8082/control control1_net1 && \
./scripts/bash/1_add_bridge.sh  http://localhost:7000 http://172.20.128.59:8082/control control2_net1 && \
./scripts/bash/1_add_bridge.sh  http://localhost:6689 http://172.20.128.61:8081/control control1_net2 && \
./scripts/bash/1_add_bridge.sh  http://localhost:7002 http://172.20.128.62:8081/control control2_net2 && \
./scripts/bash/1_add_bridge.sh  http://localhost:6688 http://172.20.128.55:8081/post adapter1_net1 && \
./scripts/bash/1_add_bridge.sh  http://localhost:7000 http://172.20.128.57:8081/post adapter2_net1 && \
./scripts/bash/1_add_bridge.sh  http://localhost:6689 http://172.20.128.56:8082/post adapter1_net2 && \
./scripts/bash/1_add_bridge.sh  http://localhost:7002 http://172.20.128.60:8082/post adapter2_net2 && \
./scripts/bash/2_add_jobSpec.sh http://localhost:6688 ./scripts/jobSpecs/jobSpec1.json && \
./scripts/bash/2_add_jobSpec.sh http://localhost:7000 ./scripts/jobSpecs/jobSpec2.json && \
./scripts/bash/2_add_jobSpec.sh http://localhost:6689 ./scripts/jobSpecs/jobSpec3.json && \
./scripts/bash/2_add_jobSpec.sh http://localhost:7002 ./scripts/jobSpecs/jobSpec4.json && \
npx truffle exec './scripts/init/1_set_jobId.js' --network rinkeby jobSpec1.json && \
npx truffle exec './scripts/init/1_set_jobId.js' --network rinkeby jobSpec2.json && \
npx truffle exec './scripts/init/1_set_jobId.js' --network binancetestnet jobSpec3.json && \
npx truffle exec './scripts/init/1_set_jobId.js' --network binancetestnet jobSpec4.json