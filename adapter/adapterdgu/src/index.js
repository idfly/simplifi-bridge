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
    
    await worker.connect(process.env.LISTEN_NETWORK);
    worker.monitor();
    
    dexpool   = new worker.web3.eth.Contract(dexPool.abi, process.env.POOL_ADDRESS);
    ownerPool = (await worker.web3.eth.getAccounts())[0];

    console.log(`\nSTART SUCCESS\n________________________\n\nLISTEN_NETWORK: ${process.env.LISTEN_NETWORK}\nCHAIN_ID: ${await worker.web3.eth.getChainId()}\nPOOL_ADDRESS: ${process.env.POOL_ADDRESS}\nORACLE_CONTRACT_ADDRESS: ${process.env.ORACLE_CONTRACT_ADDRESS}\n\n`);

    

 })();

const app = express();
app.use(bodyParser.json());


/**
 *  Получаем запрос и ходим в другую сеть 
 */
app.post('/post', async function (req, res) {
    console.log('REQUEST /post', req.body);

    let responseData = null;
    let data  = '0x'+req.body.data.selector;
    // for staticcall
    if(req.body.data.request_type === 'get')  responseData =  await GetType(data, req.body.id);
    // for call
    if(req.body.data.request_type === 'set')  responseData =  await SetType(data, req.body.id);


    console.log('RESPONSE /post ', responseData);
    res.status(200).send(responseData);
});


async function SetType(data, id){
try{
    const tx  = await dexpool.methods.receiver(data).send({from: ownerPool});

    console.log(`>>>>>>>>>>>>>>> STATUS TRANSACTION: ${tx.status}`);

    //TODO ожидание пока worker поймает из противоположной сети tx.status === true ? ОК : false === rejecteed
    await worker.timeout(10000);

    let responseData = {};
        responseData.jobRunID = id;
        responseData.data     = {result: tx.transactionHash, tx: tx };


    return responseData

}catch(e){console.log(e);}    

}

async function GetType(data, id){

    let response = await dexpool.methods.lowLevelGet(data).call();
    let responseData          = {};
        responseData.jobRunID = id;
        responseData.data     = {result: response};

    return responseData;    
}

app.get('/ping', async function (req, res) {
    res.status(200).send({ping: "PONG"});
});

/**
* Test call (changing state)
*/
app.get('/testSet', async function (req, res) {
    console.log('/testSet', req.body);
   
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

/**
* Test staticcall 
*/
app.get('/testGet', async function (req, res) {
    console.log('/testGet', req.body);
   
    // the owner - his deployed smart-contract on Net2
    let ownerPool = (await worker.web3.eth.getAccounts())[0];
    // this is represents of bytes memory out = abi.encodeWithSelector(bytes4(keccak256(bytes('_getTest()'))));
    let data = '0x49eba8f7';
    //pass 'data' for call inside smart-contracts
    const getResult  = await dexpool.methods.lowLevelGet(data).call();
    
    console.log('Result staticcall ', getResult);

    
    res.status(200).send({});

});








let listener = app.listen(process.env.PORT, function () {
    console.log("Adaptor listening on", listener.address().address + listener.address().port);
});