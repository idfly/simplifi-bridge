#! /bin/bash


echo  \# env for connect to network2 >env_connect_to_network_2.env
echo PORT=${1:-"null"} >>env_connect_to_network_2.env
echo LISTEN_NETWORK=${2:-"null"} >>env_connect_to_network_2.env
echo POOL_ADDRESS=${3:-"null"} >>env_connect_to_network_2.env
echo ORACLE_CONTRACT_ADDRESS=${4:-"null"} >>env_connect_to_network_2.env