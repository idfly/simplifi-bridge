const GanacheChainlinkClient = artifacts.require('GanacheChainlinkClient');
const LinkToken = artifacts.require('LinkToken');
require('dotenv').config({ path: '../build/addrs_network1.env' })
require('dotenv').config({ path: '../build/addrs_network2.env' })


module.exports = async callback => {
	

	let adr = process.argv[5] === 'network1' ? 'CLIENT1_ADDRESS' : process.argv[5] === 'network2' ? 'CLIENT2_ADDRESS' : '0x0';

	console.log(`========================== TRANSFER LINKS TO ${adr} ==========================`);

	const ganacheClient = await GanacheChainlinkClient.at(process['env'][adr]);
	const tokenAddress  = await ganacheClient.getChainlinkToken();
	const token         = await LinkToken.at(tokenAddress);
    console.log(`Transfering 5 LINK to ${ganacheClient.address}...`);
    const tx = await token.transfer(ganacheClient.address, `100000000000000000000`);
    console.log(`Transfer succeeded! Transaction ID: ${tx.tx}.`);

    //const tx = await ganacheClient.requestEthereumPrice("0x50Ce76f85A835F6385aeeE25322D832018195668", "6225134b11354742aec6a5cc5ed90895");
    //console.log('Transfer succeeded! Transaction ID:', JSON.stringify(tx));
    

  callback();
}
