const getAddr = require('./get-addr');

const Oracle = require('@chainlink/contracts/truffle/v0.6/Oracle')

module.exports = async callback => {
  const accountAddr = await getAddr();
  console.log("getAddr", accountAddr)
  
  let oracle = Oracle.at('0x3899e4a409E8615eA9E1739fD9eBc3E1B76B6e56');

  console.log("start")

  console.log(`Setting fulfill permission to true for ${accountAddr}...`);
  const tx = await oracle.setFulfillmentPermission(accountAddr, true);
  console.log(`Fulfillment succeeded! Transaction ID: ${tx.tx}.`);

  const accounts = await web3.eth.getAccounts();
  console.log(`Sending 1 ETH from ${accounts[0]} to ${accountAddr}.`);
  const result = await web3.eth.sendTransaction({from: accounts[0], to: accountAddr, value: '1000000000000000000'});
  console.log(`Transfer succeeded! Transaction ID: ${result.transactionHash}.`);

  callback();
}
