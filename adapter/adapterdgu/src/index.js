'use strict'

require('dotenv').config();
const express    = require('express');
const bodyParser = require('body-parser');

const Worker = require('./modules/worker');

//let initObj =  {web3_1:web3_1, web3_2: web3_2, url_1:process.env.ETH_URL_1, url_2:process.env.ETH_URL_2};

(async () => {
     
    
    let  worker1 = new Worker();
    let  worker2 = new Worker();
    
    await worker1.connect(process.env.ETH_URL_1);
    worker1.monitor();

    await worker2.connect(process.env.ETH_URL_2);
    worker2.monitor();
    

/**
 * пришел с пеовлй сети
 * лег в рест
 * рест пониманет что ему дергнуть из запроса и  пошел дергать транзакцию (get)
 */
    

 })();

const app = express();
app.use(bodyParser.json());



app.post('/post', function (req, res) {
    console.log('/post', req.body);
    let responseData = {
        
        "jobRunID": req.body.id,
        "data": {
            "result": '0x3135'
            }
        
        
          
    }

    console.log('/post ', responseData);
    res.status(200).send(responseData);

    //adaptor.gcpservice(req, res)
});



let listener = app.listen(process.env.PORT, function () {
    console.log("Adaptor listening on", listener.address().address + listener.address().port);
});