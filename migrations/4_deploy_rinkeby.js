const { exec } = require('child_process');

const MyContract    = artifacts.require('MyContract')
const DexPool       = artifacts.require('DexPool')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const { Oracle }    = require('@chainlink/contracts/truffle/v0.6/Oracle')
const { Hexstring } = require('../lib/Hexstring')

const { writeEnv } = require('../utils/helper');

const LINK_CONTRACT_ADDRESS   = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';
const ORACLE_CONTRACT_ADDRESS = '0x09008c3049784eD132bd076C083ad44091C9e55b';
const DAI_ADDRESS             = '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea';




module.exports = async (deployer, network, accounts) => {

  
  if (network === 'rinkeby') {

    
            LinkToken.setProvider(deployer.provider)
            Oracle.setProvider(deployer.provider)
            Hexstring.setProvider(deployer.provider)

            try {

                              await deployer.deploy(Hexstring, { from: accounts[0] })
              let hexstring = await Hexstring.deployed();

              let linkToken = await LinkToken.at(LINK_CONTRACT_ADDRESS);
              let oracle    = await Oracle.at(ORACLE_CONTRACT_ADDRESS);

                              await deployer.deploy(MyContract, linkToken.address, oracle.address, { from: accounts[0] })
              let client    = await MyContract.deployed();

                              await deployer.deploy(DexPool, DAI_ADDRESS, client.address, hexstring.address);
              let dexPool   = await DexPool.deployed();

              
              await writeEnv(linkToken.address, oracle.address, client.address, dexPool.address, 'rinkeby');

              console.log('>> Generate env for external adapter in binancetestnet')
              exec(`${process.cwd()}/scripts/bash/update_env_adpter_in_network2.sh 8082 rinkeby ${dexPool.address} ${oracle.address} `, { maxBuffer: 1024 * 100000000 }, (err, stdout, stderr) => {
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
