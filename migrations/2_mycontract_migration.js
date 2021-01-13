const MyContract = artifacts.require('MyContract')
const DigiUToken = artifacts.require('DigiUToken')
const {LinkToken} = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const {Oracle} = require('@chainlink/contracts/truffle/v0.6/Oracle')

module.exports = async (deployer, network, [defaultAccount]) => {
    // Local (development) networks need their own deployment of the LINK
    // token and the Oracle contract
    if (!network.startsWith('live')) {
        LinkToken.setProvider(deployer.provider)
        Oracle.setProvider(deployer.provider)

        try {
            await deployer.deploy(LinkToken, {from: defaultAccount})
            await deployer.deploy(Oracle, LinkToken.address, {from: defaultAccount})
            await deployer.deploy(DigiUToken, {from: defaultAccount})
            DigiUToken.deployed().then(
                this.digiuToken = await DigiUToken.new({from: defaultAccount})
            )
            console.log("this.digiuToken.address", this.digiuToken.address)
            await deployer.deploy(MyContract, LinkToken.address, this.digiuToken.address)
        } catch (err) {
            console.error(err)
        }
    } else {
        // For live networks, use the 0 address to allow the ChainlinkRegistry
        // contract automatically retrieve the correct address for you
        deployer.deploy(MyContract, '0x0000000000000000000000000000000000000000')
    }
}
