#! /bin/bash

echo  "# env for connect to ${2:-\"null\"}  
PORT=${1:-\"null\"}
LISTEN_NETWORK=${2:-\"null\"}
POOL_ADDRESS=${3:-\"null\"}
ORACLE_CONTRACT_ADDRESS=${4:-\"null\"}
TOKENPOOL_ADDRESS=${5:-\"null\"}
BRIDGE_ADDRESS=${6:-\"null\"}"  > $7