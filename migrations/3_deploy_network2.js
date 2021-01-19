const { exec } = require('child_process');

const MyContract    = artifacts.require('MyContract')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const { Oracle }    = require('@chainlink/contracts/truffle/v0.6/Oracle')
const DexPool       = artifacts.require('DexPool')
const { Hexstring } = require('../lib/Hexstring')

const { writeEnv } = require('../utils/helper');


module.exports = async (deployer, network, accounts) => {

  /**
  *   Local (development) networks need their own deployment of the LINK token and the Oracle contract
  */

  if (network.startsWith('network2')) {

            LinkToken.setProvider(deployer.provider)
            Oracle.setProvider(deployer.provider)
            Hexstring.setProvider(deployer.provider)

            try {

                              await deployer.deploy(Hexstring, { from: accounts[0] })
              let hexstring = await Hexstring.deployed();

                              await deployer.deploy(LinkToken, { from: accounts[0] })
              let linkToken = await LinkToken.deployed();

                              await deployer.deploy(Oracle, LinkToken.address, { from: accounts[0] })
              let oracle    = await Oracle.deployed();

                              await deployer.deploy(MyContract, LinkToken.address, oracle.address, { from: accounts[0] })
              let client    = await MyContract.deployed();

                              await deployer.deploy(DexPool, '0x0000000000000000000000000000000000000000', client.address, hexstring.address);
              let dexPool   = await DexPool.deployed();

              
              await writeEnv(linkToken.address, oracle.address, client.address, dexPool.address, 'network2');

              console.log('>> Generate env for external adapter in network1  (i.e. for connect to network 2)')
              exec(`${process.cwd()}/scripts/bash/update_env_adpter_in_network1.sh 8081 ws://172.20.128.12:8545 ${dexPool.address} ${oracle.address} `, { maxBuffer: 1024 * 100000000 }, (err, stdout, stderr) => {
                if (err) {
                    console.log('THROW ERROR', err);
                    return;
                }
              });

            } catch (err) {
              console.error(err)
            }
  
    }
}