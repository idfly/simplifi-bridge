const MyContract    = artifacts.require('MyContract')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const { Oracle }    = require('@chainlink/contracts/truffle/v0.6/Oracle')

const { writeEnv } = require('../utils/helper');


module.exports = async (deployer, network, accounts) => {

  /**
  *   Local (development) networks need their own deployment of the LINK token and the Oracle contract
  */

  if (network.startsWith('network1')) {

            LinkToken.setProvider(deployer.provider)
            Oracle.setProvider(deployer.provider)

            try {

                              await deployer.deploy(LinkToken, { from: accounts[0] })
              let linkToken = await LinkToken.deployed();

                              await deployer.deploy(Oracle, LinkToken.address, { from: accounts[0] })
              let oracle    = await Oracle.deployed();

                              await deployer.deploy(MyContract, LinkToken.address, '0x0000000000000000000000000000000000000000')
              let client    = await MyContract.deployed();

              
              await writeEnv(linkToken.address, oracle.address, client.address);

            } catch (err) {
              console.error(err)
            }
  
    }
}
