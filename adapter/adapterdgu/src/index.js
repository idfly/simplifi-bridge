'use strict'

require('dotenv').config();
const express    = require('express');
const bodyParser = require('body-parser');

const dexPool = require("./abi/DexPool.json");

const Worker = require('./modules/worker');

let  worker    = null;  // opposite network
let  dexpool   = null;  // opposite network
let  ownerPool = null;  // opposite network

(async () => {

    worker = new Worker();
    
    await worker.connect(process.env.ETH_URL);
    worker.monitor();

    
    dexpool   = new worker.web3.eth.Contract(dexPool.abi, process.env.POOL_ADDRESS);
    ownerPool = (await worker.web3.eth.getAccounts())[0];
    

 })();

const app = express();
app.use(bodyParser.json());


/**
 *  Получаем запрос и ходим в другую сеть 
 */
app.post('/post', async function (req, res) {
    console.log('/post', req.body);

    let data  = '0x'+req.body.data.selector;
    const tx  = await dexpool.methods.receiver(data).send({from: ownerPool});

    //TODO ожидание пока worker поймает из противоположной сети tx.status === true ? ОК : false === rejecteed
    await worker.timeout(15000);

    let responseData = {};
        responseData.jobRunID = req.body.id;
        responseData.data     = {result: tx.transactionHash, tx: tx };
        

    console.log('/post ', responseData);
    res.status(200).send(responseData);


});


/** */
app.get('/test', async function (req, res) {
    console.log('/test', req.body);
   
    // the owner - his deployed smart-contract on Net2
    let ownerPool = (await worker.web3.eth.getAccounts())[0];
    // this is represents of bytes memory out = abi.encodeWithSelector(bytes4(keccak256(bytes('_setTest(uint256)'))), amount);
    let data = '0xfec102800000000000000000000000000000000000000000000000008ac7230489e80000';
    //pass 'data' for call inside smart-contracts
    const tx  = await dexpool.methods.receiver(data).send({from: ownerPool});
    console.log(tx);

    // shoud be 10000000000000000000
    console.log('New value is ', await dexpool.methods.test().call());

    
    res.status(200).send({});

});








let listener = app.listen(process.env.PORT, function () {
    console.log("Adaptor listening on", listener.address().address + listener.address().port);
});