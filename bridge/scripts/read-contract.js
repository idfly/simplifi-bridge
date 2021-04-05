const Bridge = artifacts.require('Bridge')

/*
  This script makes it easy to read the data variable
  of the requesting contract.
*/

module.exports = async callback => {
  const mc = await Bridge.deployed()
  const data = await mc.data.call()
  callback(data)
}
