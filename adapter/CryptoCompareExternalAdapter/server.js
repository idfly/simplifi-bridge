const express = require('express');
const bodyParser = require('body-parser');
const adaptor = require('./index');

const app = express();
app.use(bodyParser.json());

app.get('/', function (req, res) {
    console.log('/ ', req.body);
    //adaptor.gcpservice(req, res)
});

app.post('/', function (req, res) {
    console.log('/ ', req.body);
    //adaptor.gcpservice(req, res)
});

app.post('/post', function (req, res) {
    console.log('/post', req.body);
    let responseData = {
        jobRunID: req.body.id,
        data: {result: 77}
    }

    console.log('/post ', responseData);
    res.status(200).send(responseData);

    //adaptor.gcpservice(req, res)
});


app.get('/get', function (req, res) {
    console.log('/get ', req.body);
    //adaptor.gcpservice(req, res)
});


let listener = app.listen(process.env.PORT, function () {
    console.log("CryptoCompare External Adaptor listening on", listener.address().address + listener.address().port);
});
