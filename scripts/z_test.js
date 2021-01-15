const GanacheChainlinkClient = artifacts.require('GanacheChainlinkClient');
const LinkToken = artifacts.require('LinkToken');
let env_net1 = require('dotenv').config({ path: '../build/addrs_network1.env' })
let env_net2 = require('dotenv').config({ path: '../build/addrs_network2.env' })


module.exports = async callback => {
	

	let adr = process.argv[5] === 'network1' ? env_net1.parsed.CLIENT1_ADDRESS : process.argv[5] === 'network2' ? env_net2.parsed.CLIENT2_ADDRESS : '0x0';

	let adr_oracul = process.argv[5] === 'network1' ? env_net1.parsed.ORACLE_CONTRACT_ADDRESS : process.argv[5] === 'network2' ? env_net2.parsed.ORACLE_CONTRACT_ADDRESS : '0x0';

	const ganacheClient = await GanacheChainlinkClient.at(adr);
	const tokenAddress  = await ganacheClient.getChainlinkToken();
	const token         = await LinkToken.at(tokenAddress);
	

    const tx = await ganacheClient.requestEthereumPrice(adr_oracul, "3ecae75951284377b84ce65407780933");
    console.log('Transfer succeeded! Transaction ID:', JSON.stringify(tx));

    let balance = await token.balanceOf(ganacheClient.address);
    console.log('balance ', balance.toString());
    

  callback();
}
