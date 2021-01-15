const clUtils = require('./cl-utils');
const Web3 = require('web3');
const EthProvider = new Web3.providers.HttpProvider("http://127.0.0.1:7545/");
const {Oracle} = require('@chainlink/contracts/truffle/v0.6/Oracle');



module.exports = async callback => {

    Oracle.setProvider(EthProvider);
let or = await Oracle.at('0xfc4c2cabf5a260ae248e86fab3c5903ba730b78b')
console.log(or.address)

    console.log(1)
    // const oracle = await Oracle.deployed();
    console.log(2)
    try {
    const accountAddr = await clUtils.getAcctAddr();
    } catch(e) {
    console.log(e)    
    }
    console.log(3)
    console.log(`Setting fulfill permission to true for ${accountAddr}...`);
    const tx = await oracle.setFulfillmentPermission(accountAddr, true);
    console.log(`Fulfillment succeeded! Transaction ID: ${tx.tx}.`);

    const accounts = await web3.eth.getAccounts();
    console.log(`Sending 1 ETH from ${accounts[0]} to ${accountAddr}.`);
    const result = await web3.eth.sendTransaction({from: accounts[0], to: accountAddr, value: '1000000000000000000'});
    console.log(`Transfer succeeded! Transaction ID: ${result.transactionHash}.`);

    callback();
}
