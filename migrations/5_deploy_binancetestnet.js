const { exec } = require('child_process');

const MyContract    = artifacts.require('MyContract')
const DexPool       = artifacts.require('DexPool')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const { Oracle }    = require('@chainlink/contracts/truffle/v0.6/Oracle')
const { Hexstring } = require('../lib/Hexstring')

const { writeEnv, initAddresses } = require('../utils/helper');


module.exports = async (deployer, network, accounts) => {

  
  if (network === 'binancetestnet') {
     try{
            
            LinkToken.setProvider(deployer.provider)
            Oracle.setProvider(deployer.provider)
            Hexstring.setProvider(deployer.provider)

            let addresses = await initAddresses(network, null);

            const LINK_CONTRACT_ADDRESS   = addresses.LINK_CONTRACT_ADDRESS;
            const ORACLE_CONTRACT_ADDRESS = addresses.ORACLE_CONTRACT_ADDRESS;
            const DAI_ADDRESS             = addresses.TOKENPOOL_ADDRESS;

                              await deployer.deploy(Hexstring, { from: accounts[0] })
              let hexstring = await Hexstring.deployed();

              let linkToken = await LinkToken.at(LINK_CONTRACT_ADDRESS);
              let oracle    = await Oracle.at(ORACLE_CONTRACT_ADDRESS);

                              await deployer.deploy(MyContract, linkToken.address, oracle.address, { from: accounts[0] })
              let client    = await MyContract.deployed();

                              await deployer.deploy(DexPool, DAI_ADDRESS, client.address, hexstring.address);
              let dexPool   = await DexPool.deployed();

              
              await writeEnv(linkToken.address, oracle.address, client.address, dexPool.address, DAI_ADDRESS, 'binancetestnet');

              console.log('>> Generate env for external adapter in rinkeby')
              exec(`${process.cwd()}/scripts/bash/update_env_adpter_in_network1.sh 8081 binancetestnet ${dexPool.address} ${oracle.address} `, { maxBuffer: 1024 * 100000000 }, (err, stdout, stderr) => {
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
