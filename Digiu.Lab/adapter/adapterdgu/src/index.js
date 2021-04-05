'use strict'

require('dotenv').config();
const express    = require('express');
const bodyParser = require('body-parser');

const bridgeAbi = require("./abi/Bridge.json");

const Worker = require('./modules/worker');

let  worker       = null;  // opposite network
let  bridge       = null;  // opposite network
let  ownerAdapter = null;  // this potentially may be bottleneck

(async () => {

    worker = new Worker();
    
    await worker.connect(process.env.LISTEN_NETWORK);
//    worker.monitor();
    
    bridge      = new worker.web3.eth.Contract(bridgeAbi.abi, process.env.BRIDGE_ADDRESS);

    // obtain the rigth address
    let num = (await worker.web3.eth.getAccounts()).filter(addr => addr === worker.web3.eth.accounts.privateKeyToAccount(process.env.SK).address);
    ownerAdapter = num[0];

    console.log(`\nSTART SUCCESS\n________________________\n\nOWNER ADAPTER ${ownerAdapter}\nLISTEN_NETWORK: ${process.env.LISTEN_NETWORK}\nCHAIN_ID: ${await worker.web3.eth.getChainId()}\nPOOL_ADDRESS: ${process.env.POOL_ADDRESS}\nORACLE_CONTRACT_ADDRESS: ${process.env.ORACLE_CONTRACT_ADDRESS}\n\n`);

    

 })();

const app = express();
app.use(bodyParser.json());

/**
 *  Получаем запрос, Осуществляем контроль. Подписание. Отдаем chainlink node to job.
 */
app.post('/control', async function (req, res) {
 try{
        //todo for get
        console.log('REQUEST /control', req.body);

        let responseData = null;
        // for staticcall
        if(req.body.data.request_type === 'setResponse')  responseData =  await SetTypeControlRes(req);
        if(req.body.data.request_type === 'get')          responseData =  req.body;
        // for call
        if(req.body.data.request_type === 'setRequest')  responseData =  await SetTypeControlReq(req);


        console.log('RESPONSE /post ', responseData);

        
        res.status(200).send(responseData);

    }catch(e){ console.log(e); res.status(500).send({});}    
});


/**
 *  Получаем запрос и ходим в другую сеть 
 */
app.post('/post', async function (req, res) {
    try{
        console.log('REQUEST /post', req.body);

        let responseData = null;
        let data  = '0x'+req.body.data.selector;
        // for staticcall
        if(req.body.data.request_type === 'get')  responseData =  await GetType(data, req.body.id);
        // for call
        if(req.body.data.request_type === 'setRequest')  responseData =  await SetTypeAuditorRequest(req.body.data.dataPrefix.substring(2, 66),
                                                                                                     req.body.data.sign, 
                                                                                                     data,
                                                                                                     req.body.meta.initiator.transactionHash, 
                                                                                                     req.body.data.receive_side,
                                                                                                     req.body.data.callback);

        if(req.body.data.request_type === 'setResponse')  responseData =  await SetTypeAuditorResponse('0x' + req.body.data.correlationId,
                                                                                                       req.body.data.sign, 
                                                                                                       req.body.meta.initiator.transactionHash,
                                                                                                       req.body.data.dataPrefix.substring(0, 66));


        console.log('RESPONSE /post ', responseData);
        res.status(200).send(responseData);

     }catch(e){ console.log(e); res.status(500).send({});}
});

async function SetTypeControlRes(req){
    try{
            let for_approve = await worker.web3.eth.getTransactionReceipt(req.body.meta.initiator.transactionHash);
            if(req.body.meta.initiator.blockHash != for_approve.blockHash) throw Error('TODO');
            if(for_approve.status != true || for_approve.status != '0x1') throw Error('TODO');

            let correlationId  = '0x'+req.body.data.correlationId;
            let reqId          = req.body.data.dataPrefix.substring(0, 66);
            let tx             = req.body.meta.initiator.transactionHash;
            const hashMessage  = worker.web3.utils.soliditySha3(correlationId, tx, reqId);
            let sign = await worker.web3.eth.sign(hashMessage, ownerAdapter);

            //https://medium.com/@yaoshiang/ethereums-ecrecover-openzeppelin-s-ecdsa-and-web3-s-sign-8ff8d16595e1
            const v1 = '0x' + sign.slice(128+2, 130+2);
            sign = v1 == '0x00' ? sign.substring(0, sign.length - 2) + '1b' : v1 == '0x01' ? sign.substring(0, sign.length - 2) + '1c' : sign;


            let responseData = req.body;
            responseData.data.sign = sign;
            responseData.data.hashMessage = hashMessage;

            return responseData;

        }catch(e){ console.log(e); throw Error('some kind error');}            

}

async function SetTypeControlReq(req){
try{
        //TODO enhancment
        let for_approve = await worker.web3.eth.getTransactionReceipt(req.body.meta.initiator.transactionHash);
        if(req.body.meta.initiator.blockHash != for_approve.blockHash) throw Error('TODO');
        if(for_approve.status != true || for_approve.status != '0x1') throw Error('TODO');

        let data           = '0x' + req.body.data.selector;
        let reqId          = req.body.data.dataPrefix.substring(2, 66);
        let tx             = req.body.meta.initiator.transactionHash;
        let receive_side   = '0x' + req.body.data.receive_side;
        const hashMessage  = worker.web3.utils.soliditySha3(reqId, data, tx, receive_side);

        let sign = await worker.web3.eth.sign(hashMessage, ownerAdapter);
        //https://medium.com/@yaoshiang/ethereums-ecrecover-openzeppelin-s-ecdsa-and-web3-s-sign-8ff8d16595e1
        const v1 = '0x' + sign.slice(128+2, 130+2);
        sign = v1 == '0x00' ? sign.substring(0, sign.length - 2) + '1b' : v1 == '0x01' ? sign.substring(0, sign.length - 2) + '1c' : sign;


        let responseData = req.body;
        responseData.data.sign = sign;
        responseData.data.hashMessage = hashMessage;

        return responseData;

    }catch(e){ console.log(e); throw Error('some kind error');}
}

async function SetTypeAuditorResponse(correlationId, sign, _tx, reqId){
    try{

            const gasPrice = await worker.web3.eth.getGasPrice();
            const tx  = await bridge.methods.receiveResponse(correlationId, sign, _tx, reqId).send({from: ownerAdapter, gas: 200000, gasPrice: gasPrice});
            //TODO negative variant
            let responseData = {};

            while(true){
                console.log(`>>>>>>>>>>>>>>> TX: ${tx.transactionHash}, WAITING RECEIPT`);
                await worker.timeout(10000);

                let receipt = await worker.web3.eth.getTransactionReceipt(tx.transactionHash);
                if (receipt != null){
                    
                    if(receipt.status == false) throw Error({error: 1, status_text:'tx status false'});
                    //responseData.jobRunID = id; now this does not require because should't be response to chainlink node
                    responseData.data     = {result: tx.transactionHash, tx: receipt };

                    break;
                }
            }

            return responseData;

        }catch(e){console.log(e); throw Error(e.message);}    
}

async function SetTypeAuditorRequest(id, sign, data, _tx, adr_receiver, cb){
    try{
        const gasPrice = await worker.web3.eth.getGasPrice();
        let tx = null;
        if(cb === 'disable'){
            tx  = await bridge.methods.receiveRequestV2(id, sign, data, _tx, '0x' + adr_receiver).send({from: ownerAdapter, gas: 500000, gasPrice: gasPrice});
        }else{
            tx  = await bridge.methods.receiveRequest(id, sign, data, _tx, '0x' + adr_receiver).send({from: ownerAdapter, gas: 500000, gasPrice: gasPrice});
        }
        //TODO negative variant
        let responseData = {};

        while(true){
            console.log(`>>>>>>>>>>>>>>> TX: ${tx.transactionHash}, WAITING RECEIPT`);
            await worker.timeout(10000);

            let receipt = await worker.web3.eth.getTransactionReceipt(tx.transactionHash);
            if (receipt != null){ 
                
                if(receipt.status == false) throw Error({error: 1, status_text:'tx status false'});
                //responseData.jobRunID = id; now this does not require because should't be response to chainlink node
                responseData.data     = {result: tx.transactionHash, tx: receipt };

                break;
            }
        }

        return responseData;

    }catch(e){console.log(e); throw Error(e.message);}    
}

async function GetType(data, id){
try{
        let response = await bridge.methods.lowLevelGet(data).call();
        let responseData          = {};
            responseData.jobRunID = id;
            responseData.data     = {result: response};

        return responseData;    

    }catch(e){console.log(e); throw Error('some kind error');}    
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
    let ownerAdapter = (await worker.web3.eth.getAccounts())[0];
    // this is represents of bytes memory out = abi.encodeWithSelector(bytes4(keccak256(bytes('_setTest(uint256)'))), amount);
    let data = '0xfec102800000000000000000000000000000000000000000000000008ac7230489e80000';
    //pass 'data' for call inside smart-contracts
    const tx  = await bridge.methods.receiveRequest(data).send({from: ownerAdapter});
    console.log(tx);

    // shoud be 10000000000000000000
    console.log('New value is ', await bridge.methods.test().call());

    
    res.status(200).send({});

});

/**
* Test staticcall 
*/
app.get('/testGet', async function (req, res) {
    console.log('/testGet', req.body);
   
    // the owner - his deployed smart-contract on Net2
    let ownerAdapter = (await worker.web3.eth.getAccounts())[0];
    // this is represents of bytes memory out = abi.encodeWithSelector(bytes4(keccak256(bytes('_getTest()'))));
    let data = '0x49eba8f7';
    //pass 'data' for call inside smart-contracts
    const getResult  = await bridge.methods.lowLevelGet(data).call();
    
    console.log('Result staticcall ', getResult);

    
    res.status(200).send({});

});








let listener = app.listen(process.env.PORT, function () {
    console.log("Adaptor listening on", listener.address().address + listener.address().port);
});
