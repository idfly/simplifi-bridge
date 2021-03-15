const argv = require('minimist')(process.argv.slice(2), {string: ['typenet','net1', 'net2']});
const Web3 = require('web3');
const { checkoutProvider, timeout } = require('../../utils/helper');
const { Hexstring }  = require('../../lib/Hexstring');

const mockPool1    = artifacts.require('MockDexPool');
const mockPool2    = artifacts.require('MockDexPool');
const brigdePart1  = artifacts.require('Bridge');
const brigdePart2  = artifacts.require('Bridge');

const factoryProvider =  checkoutProvider(argv);

let envNet1 = require('dotenv').config({ path: `./build/addrs_${argv.net1}.env` });
let envNet2 = require('dotenv').config({ path: `./build/addrs_${argv.net2}.env` });

const { expectEvent } = require('@openzeppelin/test-helpers');

// todo gas consumtion
contract('Brigde', (deployer, accounts) => {

  beforeEach(async () => {
    
  });
  
  
  before(async () => {

    brigdePart1.setProvider(factoryProvider.web3Net1);
    brigdePart2.setProvider(factoryProvider.web3Net2);

    this.br1      = await brigdePart1.at(envNet1.parsed.CLIENT_ADDRESS);
    this.br2      = await brigdePart2.at(envNet2.parsed.CLIENT_ADDRESS);

    /** users */
    this.userNet1 = (await brigdePart1.web3.eth.getAccounts())[0];
    this.userNet2 = (await brigdePart2.web3.eth.getAccounts())[0];
    /** utils */
    Hexstring.setProvider(factoryProvider.web3Net1);
    let hexstring1 = await Hexstring.new({from: this.userNet1});
    Hexstring.setProvider(factoryProvider.web3Net2);
    let hexstring2 = await Hexstring.new({from: this.userNet2});
    /** mock dexpool in one evm based blockchain and in another evm blockchain */
    mockPool1.setProvider(factoryProvider.web3Net1);
    mockPool2.setProvider(factoryProvider.web3Net2);
    this.mp1 = await mockPool1.new(this.br1.address, hexstring1.address, {from: this.userNet1});
    this.mp2 = await mockPool2.new(this.br2.address, hexstring2.address, {from: this.userNet2});

  });

 
  describe('simple end-to-end test', async () => {

    it('change state from first to second sides', async () => {

      let testData = 10;
      /** send end-to-end request */
      let receipt = await this.mp1.sendRequestTest(testData, this.mp2.address, {from: this.userNet1});
      let t = expectEvent(receipt, 'RequestSended');
      let result = await this.mp1.getPendingRequests(t.args[0]);
      assert.equal(result[1], '0x3078310000000000000000000000000000000000000000000000000000000000', 'tx in pending on other side');
      
      // wait on the second part the excuted tx
      while(true){
       let result = ~~(await this.mp2.testData()).toString();
       if(result === testData) break;
       await timeout(500);
      }

      while(true){
        let result = await this.mp1.getPendingRequests(t.args[0]);  
        if(result[1] !== '0x3078310000000000000000000000000000000000000000000000000000000000') break;
        await timeout(500);
      }

      // checking out result on started pool the result of execute all process
      result = await this.mp1.getPendingRequests(t.args[0]);
      assert.notEqual(result[1], '0x3078310000000000000000000000000000000000000000000000000000000000', 'bridge worked on both sides');

    });

    it('change state from second to first sides', async () => {

      let testData = 7;
      /** send end-to-end request */
      let receipt = await this.mp2.sendRequestTest(testData, this.mp1.address, {from: this.userNet2});
      let t = expectEvent(receipt, 'RequestSended');
      let result = await this.mp2.getPendingRequests(t.args[0]);
      assert.equal(result[1], '0x3078310000000000000000000000000000000000000000000000000000000000', 'tx in pending on other side');
      
      // wait on the second part the excuted tx
      while(true){
       let result = ~~(await this.mp1.testData()).toString();
       if(result === testData) break;
       await timeout(500);
      }

      while(true){
        let result = await this.mp2.getPendingRequests(t.args[0]);  
        if(result[1] !== '0x3078310000000000000000000000000000000000000000000000000000000000') break;
        await timeout(500);
      }

      // checking out result on started pool the result of execute all process
      result = await this.mp2.getPendingRequests(t.args[0]);
      assert.notEqual(result[1], '0x3078310000000000000000000000000000000000000000000000000000000000', 'bridge worked on both sides');

    });

    it('get state', async () => {

    });

 });

})