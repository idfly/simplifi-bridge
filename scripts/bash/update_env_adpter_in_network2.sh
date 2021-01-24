#! /bin/bash


echo  \# env for connect to network1 >env_connect_to_network_1.env
echo PORT=${1:-"null"} \# for starting nodejs >>env_connect_to_network_1.env
echo LISTEN_NETWORK=${2:-"null"} >>env_connect_to_network_1.env
echo POOL_ADDRESS=${3:-"null"} >>env_connect_to_network_1.env
echo ORACLE_CONTRACT_ADDRESS=${4:-"null"} >>env_connect_to_network_1.env