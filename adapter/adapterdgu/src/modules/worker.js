const Web3      = require("web3");
const config    = require("./config");
const oracleAbi = require("../abi/oracle_v0.6.json");


class Worker {
    
    web3;
    #blockTime;
    #latestKnownBlockNumber = -1;

    constructor(blt = 5000){
        this.#blockTime = blt;
    }


    async connect(network) {
        if(network === 'network1' || network === 'network2') { console.log(config.networks[network].host); this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://'+ config.networks[network].host +":"+ config.networks[network].port)); };
        if(network === 'binancetestnet' || network === 'rinkeby') { this.web3 = new Web3(config.networks[network].provider()); };
    }


    async monitor() {

        let currentBlockNumber = null;
        while(true){
            currentBlockNumber = await this.web3.eth.getBlockNumber();
            await this.checkCurrentBlock(currentBlockNumber)
            
            await this.timeout(this.#blockTime);
        }

    }

    async checkCurrentBlock(currentBlockNumber) {
        
        console.log("Current blockchain top: " + currentBlockNumber, " | Script is at: " + this.#latestKnownBlockNumber);
        while (this.#latestKnownBlockNumber == -1 || currentBlockNumber > this.#latestKnownBlockNumber) {
            await this.processBlock(this.#latestKnownBlockNumber == -1 ? currentBlockNumber : this.#latestKnownBlockNumber + 1);
        }
    }

    async timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Our function that will triggered for every block
    async processBlock(blockNumber) {
            console.log("We process block: " + blockNumber);
            let block = await this.web3.eth.getBlock(blockNumber);
            //console.log("new block :", JSON.stringify(block));
            block.transactions = block == null ? [] : block.transactions || [];
            for (const transactionHash of block.transactions) {
                let transaction = {};
                try{
                transaction = await this.web3.eth.getTransaction(transactionHash);
                }catch(e){ /*console.log(`error while parse tx ${transactionHash}\n`);*/}
                let transactionReceipt = await this.web3.eth.getTransactionReceipt(transactionHash);
                transaction = Object.assign(transaction, transactionReceipt);
                //console.log("Transaction: ", transactionHash);
                // Do whatever you want here
                this.getEvent(transaction);
            }
    
            this.#latestKnownBlockNumber = blockNumber;
        }

    getEvent(transaction) {

        let res = oracleAbi.abi.filter(f => f.type === 'event');
        //sha3 of event smart-contract
        res.map(m => {
            let strInputs = m.inputs.map(v => v.type).join(',');
            m.sha3 =  this.web3.utils.sha3(`${m.name}(${strInputs})`);
        });
       transaction.logs = transaction.logs || [];
       transaction.logs.map(log => {

            let search = res.filter(eventT => eventT.sha3 === log.topics[0]);
        
            
          if(log.data !== "0x" && search.length === 1){
              search[0].decogeLog = this.web3.eth.abi.decodeLog(search[0].inputs, log.data, log.topics);
              transaction.decodeLogs.push(search[0]);
              
          }else transaction.decodeLogs = [];
  

        });
        //console.log(`transaction: ${transaction.hash}, status:${transaction.status}, LOG:${transaction.decodeLogs}\n`);
        //console.log(JSON.stringify(transaction)+'\n');
        //console.log(`WORKER ADAPTER GETTING FROM ${process.env.LISTEN_NETWORK} >>> tx: ${transaction.blockHash}\nstatus:${transaction.status}\nfrom: ${transaction.from} to: ${transaction.to}\n\n`);
        
           
    }

}

module.exports = Worker;