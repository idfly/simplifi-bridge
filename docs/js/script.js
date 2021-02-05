
var vm = new Vue({
    el: '#app',
    data: {
      chains: [{id:0x4, name:"Ethereum rinkeby", icon:"ethereum.png", web:"web3eth"}, {id:0x61, name:"BSC testnet", icon:"bsc.webp",web:"web3bsc"}],
      tokensEth: [{symbol:"AAVE",addr:"0x918809f0c1d4c5e56328742406ddbf6bf7807c73",icon:"AAVE.webp",price:509}], //price bypass{symbol:"USDT",addr:"",icon:"tether.webp",price:1} {symbol:"USDC",addr:"0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b",icon:"usdc.webp",price:1}
      tokensBsc: [{symbol:"UNI",addr:"0x55797e477BE468855690c660AA2640d3E9F80Cc6",icon:"uniswap-uni.webp",price:21},{symbol:"dLINK",addr:"0x88e69c0d2d924e642965f8dd151dd2e24ba154f8",icon:"dlink.webp",price:0.1}],//{symbol:"USDC",addr:"0x64544969ed7ebf5f083679233325356ebe738930",icon:"usdc.webp",price:1}
      dexPoolETH:[{addr:"0x9f9A020ef5f14b126e2d76BD984a88a0ba9c89aA"}],
      dexPoolBSC:[{addr:"0x0B998d26B8Ab9e1caaf084Ba30ac6859Adcc236E"}],
        digiuTokenAddress:'0x0b998d26b8ab9e1caaf084ba30ac6859adcc236e',
      buttonEth: '...',
      buttonBsc: '...',
      accountEth: '',
      accountBsc: '',
      //Exchange tab
      ethChainId: '',
      bscChainId: '',
      tokenFrom: '',
      tokenTo: '',
      amountFrom: 0,
      amountTo: '',
      accountFrom: '',
      accountTo: '',
      chainFrom: '',
      chainTo: '',
      itemsFrom:{},
      itemsTo:{},
      //Liquidity tab
      amountLiqEth:'',
      amountLiqBsc:'',
      tokenLiqEth:'',
      tokenLiqBsc:'',
      price: 1,
      //balances
      balanceFrom:'-',
      balanceTo:'-',
      balanceLiqEth:'-',
      balanceLiqBsc:'-',
        balanceDigiUBsc:'-',
      dexPoolContract:'',
      tokenContract:'',
        dexPoolBalanceUNI:'',
        dexPoolBalanceAAVE:'',
    },
    watch: {
      
      amountFrom: function() {
        if (document.activeElement.id == 'num1' ) {
        amountFrom = document.getElementById(document.activeElement.id).value;
        console.log(`amountFrom ${vm.amountFrom}`)
        calcAmount('from');
        getAllAllowance();

        }
        exchButtons(1,1,'amo')
      },

        amountLiqEth: function() {
            if (document.activeElement.id == 'num3' ) {
                this.amountLiqEth = document.getElementById(document.activeElement.id).value;
                console.log(`amountLiqEth ${vm.amountLiqEth}`)
                calculateLiquidityAmount('from');
                // getAllAllowance();

            }
        },

        amountTo: function() {
        if (document.activeElement.id == 'num2' ) {
        calcAmount('to')
        }
        
      },

        amountLiqBsc: function() {
            if (document.activeElement.id == 'num4' ) {
                calculateLiquidityAmount('to');
            }
        },
      
      tokenFrom: function() {
        calcPrice('to'); 
        
        
        
      },
      tokenTo: function() {
        
        calcPrice('from');
        
      },

      buttonEth: function() {
        if (this.buttonEth.substr(0,2) == '0x') {
          document.getElementById("pulse2").classList.add("shadow");
        } else {
          document.getElementById("pulse2").classList.remove("shadow");
        }
      },

      buttonBsc: function() {
        if (this.buttonBsc.substr(0,2) == '0x') {
          document.getElementById("pulse1").classList.add("shadow");
        } else {
          document.getElementById("pulse1").classList.remove("shadow");
        }
      },

    } 
  })

console.log(`vm.dexPoolETH[0].addr ${vm.dexPoolETH[0].addr} vm.dexPoolBSC[0].addr ${vm.dexPoolBSC[0].addr}`)

var serviceContractEth = vm.dexPoolETH[0].addr, serviceContractBsc = vm.dexPoolBSC[0].addr;
// var serviceContractEth = "0x5a18D011eF7b5761D427A97865fcBbfBe3b0A660", serviceContractBsc = "0x594c420e6567b4479614a5ffc5774c0a8a391452";

var meta2 = 'Connect to MetaMask', meta1 = 'Install MetaMask';
  var bin2 = 'Connect to Binance wallet', bin1 = 'Install Binance wallet'


  //set default params
  //for exchange
  vm.tokenFrom = vm.tokensEth[0];
  vm.tokenTo = vm.tokensBsc[0];
  vm.itemsFrom = vm.tokensEth;
  vm.itemsTo = vm.tokensBsc;
  vm.chainFrom = vm.chains[0];
  vm.chainTo = vm.chains[1];
 
  //for liquidity
  vm.tokenLiqEth = vm.tokensEth[0];
  vm.tokenLiqBsc = vm.tokensBsc[0];

  function calcPrice(ft) {
    vm.price = vm.tokenFrom.price/vm.tokenTo.price; 
    calcAmount(ft);
  }

  function calcAmount(ft) {
     if (ft == 'from' && (vm.amountFrom === '' || vm.amountFrom == 0 ) ) {vm.amountTo = ''; return}
     if (ft == 'to' && (vm.amountTo === '' || vm.amountTo == 0) ) {vm.amountFrom = ''; return}

     if (ft == 'from') { vm.amountTo = BigNumber(vm.amountFrom).times(vm.price); } else { vm.amountFrom = BigNumber(vm.amountTo).div(vm.price)} ;

  }

function calculateLiquidityAmount(ft) {
    console.log(`calculating vm.amountLiqBsc from vm.amountLiqEth ${vm.amountLiqEth}`);
    if (ft == 'from') { vm.amountLiqBsc = BigNumber(vm.amountLiqEth).times(vm.price); } else { vm.amountLiqEth = BigNumber(vm.amountLiqBsc).div(vm.price);} ;



}


  //input only number
  function isNumberKey(evt,id,ft)
  {
    var data = document.getElementById(id).value;
    if((evt.charCode>= 48 && evt.charCode <= 57) || evt.charCode== 46 ||evt.charCode == 0){
    if(data.indexOf('.') > -1 || data == ''){
     if(evt.charCode== 46)
      evt.preventDefault();
    }
    }else evt.preventDefault();
  }  

setTimeout(checkInstall, 1000);

var delta =360;
  function rotate360Deg(ele){
      ele.style.webkitTransform="rotate("+delta+"deg)";
      delta+=360;
      //rotate data
      console.log(vm.chainTo.id, vm.chainFrom.id);    
      let chain,balance,amount,token,items;
      chain = vm.chainTo; vm.chainTo = vm.chainFrom; vm.chainFrom = chain;
      balance = vm.balanceTo; vm.balanceTo = vm.balanceFrom; vm.balanceFrom = balance;
      items = vm.itemsTo; vm.itemsTo = vm.itemsFrom; vm.itemsFrom = items;
      token = vm.tokenTo; vm.tokenTo = vm.tokenFrom; vm.tokenFrom = token;
      amount = vm.amountTo; vm.amountTo = vm.amountFrom; vm.amountFrom = amount;
      account = vm.accountTo; vm.accountTo = vm.accountFrom; vm.accountFrom = account;
      getAllAllowance();

  }





function setLiqToken(item, typ) {
  if (typ == 'eth') {vm.tokenLiqEth = item; fetchLiquidityDataEth()}
  else {vm.tokenLiqBsc = item; fetchLiquidityDataBsc()}
  
  //getBalanceFrom()
}


function checkInstall() {
    if (window.ethereum) { 
        window.web3eth = new Web3(ethereum);
        // window.web3eth.eth.handleRevert = true;
        vm.buttonEth = meta2;
    } else { vm.buttonEth = meta1}

    if (window.BinanceChain) {
        window.web3bsc = new Web3(BinanceChain);
        // window.web3bsc.eth.handleRevert = true;
        vm.buttonBsc = bin2;
    } else {vm.buttonBsc = bin1}

}

//Ethereum wallet

async function connectEth() {
  if (vm.buttonEth == meta1) {window.open("https://metamask.io/download.html"); return}
 await ethereum.enable();
 vm.ethChainId = await web3eth.eth.getChainId();
 const accountsEth = await web3eth.eth.getAccounts();
 vm.accountEth = accountsEth[0];
 onConnectEth();
}

function onConnectEth() {
    // Subscribe to accounts change
    ethereum.on("accountsChanged", (accounts) => {
      (accounts.length == 0) ? vm.accountEth = '' : vm.accountEth = accounts[0];
      refreshAccountDataEth()
    });
   

    // Subscribe to networkId change
    ethereum.on("chainChanged", (chainId) => {
      vm.ethChainId = chainId; 
      refreshAccountDataEth();
    });
    
    refreshAccountDataEth();
    setInterval(refreshAccountDataEth,10000);
  }

  function alertEth() {
    (vm.chainTo.id == '0x61') ? vm.balanceFrom = '-': vm.balanceTo = '-';
    exchButtons(0,0,'eth');
    document.getElementById('alerteth').innerHTML ='&#9888; Connect MetaMask to the Rinkeby Test Network!';
  }

function refreshAccountDataEth() {
  if (vm.accountEth != '') {
    vm.buttonEth = vm.accountEth.substr(0,6) + '...' + vm.accountEth.substr(38);
  } else if (window.ethereum) {vm.buttonEth = meta2} else {vm.buttonEth = meta1}
  if (vm.ethChainId != '0x4') {alertEth(); return}
    (vm.chainTo.id == '0x4') ? vm.accountTo = vm.accountEth : vm.accountFrom = vm.accountEth;
    fetchSwapDataEth();
    fetchLiquidityDataEth()
   // exchButtons(1,1,'eth');
    document.getElementById('alerteth').innerHTML ='';
  }

   
// BSC wallet

async function connectBsc() {
  if (vm.buttonBsc == "Install Binance wallet") {window.open("https://docs.binance.org/smart-chain/wallet/binance.html"); return}
 await BinanceChain.enable();
 vm.bscChainId = await web3bsc.eth.getChainId(); //alert(vm.bscChainId);
 const accountsBsc = await web3bsc.eth.getAccounts();
 vm.accountBsc = accountsBsc[0];// alert(vm.accountBsc)
 onConnectBsc();
}

function onConnectBsc() {
    // Subscribe to accounts change
    BinanceChain.on("accountsChanged", (accounts) => {
      vm.accountBsc = accounts[0];
      refreshAccountDataBsc();
    });
    
    BinanceChain.on("chainChanged", (chainId) => {
      vm.bscChainId = chainId;
      refreshAccountDataBsc();
    });
    refreshAccountDataBsc();
    setInterval(refreshAccountDataBsc,10000);
  }

function alertBsc() {
  (vm.chainTo.id == '0x61') ? vm.balanceTo = '-': vm.balanceFrom = '-';
  exchButtons(0,0,'bsc');
  document.getElementById('alertbsc').innerHTML ='&#9888; Connect Binance wallet to the BSC testnet!';

}

function refreshAccountDataBsc() {
    
    if (vm.accountBsc != '') {
      vm.buttonBsc = vm.accountBsc.substr(0,6) + '...' + vm.accountBsc.substr(38);
     } else if (window.BinanceChain) {vm.buttonBsc = bin2} else {vm.buttonBsc = bin1}
    if (vm.bscChainId != '0x61') {alertBsc(); return}
    (vm.chainTo.id == '0x61') ? vm.accountTo = vm.accountBsc : vm.accountFrom = vm.accountBsc;
    fetchSwapDataBsc();
    fetchLiquidityDataBsc();
    document.getElementById('alertbsc').innerHTML ='';
    fetchDigiUtokenBalanace();
    fetchDexPoolBalanace();
    }


      
//BLOCKCHAIN integration
//exchange tab
// fetch accounts data
async function fetchSwapDataBsc() {

 
if (vm.chainTo.id == '0x61') {
    const tokenContract = new web3bsc.eth.Contract(erc20abi, vm.tokenTo.addr);
   tokenContract.methods.balanceOf(vm.accountTo).call().then(function (bal) {
    vm.balanceTo = Math.round(bal*1e-10)/1e8;})
} else {
  const tokenContract = new web3bsc.eth.Contract(erc20abi, vm.tokenFrom.addr);
  tokenContract.methods.balanceOf(vm.accountFrom).call().then(function (bal) {
  vm.balanceFrom = Math.round(bal*1e-10)/1e8;})
}

}

async function fetchSwapDataEth() {
 
  if (vm.chainTo.id == '0x4') {
    const tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenTo.addr);
    tokenContract.methods.balanceOf(vm.accountTo).call().then(function (bal) {
    vm.balanceTo = Math.round(bal*1e-10)/1e8;});
} else {
  const tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenFrom.addr);
  tokenContract.methods.balanceOf(vm.accountFrom).call().then(function (bal) {
  vm.balanceFrom = Math.round(bal*1e-10)/1e8;})
}

}


async function fetchDigiUtokenBalanace() {
    let tokenContract = new web3bsc.eth.Contract(erc20abi, vm.digiuTokenAddress);
    tokenContract.methods.balanceOf(vm.accountBsc).call().then(function (bal) {
        vm.balanceDigiUBsc = Math.round(bal * 1e-10) / 1e8;
        console.log("fetchDigiUtokenBalanace", vm.balanceDigiUBsc);

    });
}
    async function fetchDexPoolBalanace() {
         tokenContract = new web3bsc.eth.Contract(erc20abi, vm.tokenLiqBsc.addr);
        tokenContract.methods.balanceOf(vm.dexPoolBSC[0].addr).call().then(function (bal) {
            vm.dexPoolBalanceUNI = Math.round(bal*1e-10)/1e8;
            console.log("poolBalance", vm.dexPoolBalanceUNI);
        });
        tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenLiqEth.addr);
        tokenContract.methods.balanceOf(vm.dexPoolETH[0].addr).call().then(function (bal) {
            vm.dexPoolBalanceAAVE = Math.round(bal*1e-10)/1e8;
            console.log("poolBalance", vm.dexPoolBalanceAAVE);
        });

}

//liquidity tab
async function fetchLiquidityDataEth() {
  
  const tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokenLiqEth.addr);
  tokenContract.methods.balanceOf(vm.accountEth).call().then(function (bal) {
  vm.balanceLiqEth = Math.round(bal*1e-10)/1e8;})

}

async function fetchLiquidityDataBsc() {
    const tokenContract = new web3bsc.eth.Contract(erc20abi, vm.tokenLiqBsc.addr);
    tokenContract.methods.balanceOf(vm.accountBsc).call().then(function (bal) {
    vm.balanceLiqBsc = Math.round(bal*1e-10)/1e8;})
}


var ae = ab = se = sb = cc =  0;
function exchButtons(a,s,chain) {

  
  if (chain == 'eth') { ae = a; se = s}
  if (chain == 'bsc') { ab = a; sb = s}
  
  var aa = ae*ab, ss = se*sb;//

  if (chain == 'amo'){
      if (vm.amountFrom > 0) { cc = 1; } else { cc = 0 }
  } 

  if (chain == 'allo'){
    if (alloEth*alloBsc > 0) { aa = 0; ss = 1}   
} 
  console.log(`${aa} ${alloEth} ${alloBsc} ${aa == 1 && alloEth*alloBsc == 0}`)
  if (aa == 1 || alloEth*alloBsc == 0 ) document.querySelector("#approve").removeAttribute("disabled"); else {document.querySelector("#approve").setAttribute("disabled", "disabled");}
  console.log(`${ss} ${cc} ${ss == 1 && cc == 1}`)
  if (ss == 1 && cc == 1) document.querySelector("#swap").removeAttribute("disabled"); else document.querySelector("#swap").setAttribute("disabled", "disabled");


  }




//APPROVE

  var alloEth = alloBsc = 0, approveTokenBsc, approveTokenEth;


function calcToWei(x) {
    const tokenDecimals = web3eth.utils.toBN(18);
    const tokenAmountToApprove = web3eth.utils.toBN(x);
    const calculatedValue = web3eth.utils.toHex(tokenAmountToApprove.mul(web3bsc.utils.toBN(10).pow(tokenDecimals)));
    console.log(`calculatedValue ${calculatedValue}`)
    return calculatedValue;
}

  async function approving() {
      fetchDigiUtokenBalanace();
      if (vm.chainFrom.id == '0x61') {
           approveTransferToServiceContract(web3bsc, vm.amountFrom, vm.tokensBsc[0].addr, serviceContractBsc, vm.accountFrom);
      } else {
           approveTransferToServiceContract(web3eth, vm.amountFrom, vm.tokensEth[0].addr, serviceContractEth, vm.accountFrom);
      }
  }

  var accs;


async function confirmSwap() {
    fetchDigiUtokenBalanace();
    console.log(`Swapping amount ${vm.amountFrom}`);
if (vm.chainFrom.id == '0x61'){
confirmSwapBSC();
} else {
      dexPoolContract = await new web3eth.eth.Contract(dexPoolABI, vm.dexPoolETH[0].addr);
      console.log(`vm.dexPoolETH.addr ${vm.dexPoolETH[0].addr} contract  ${dexPoolContract._address}`)
      const calculatedValue = await calcToWei(vm.amountFrom);
      await web3bsc.eth.getAccounts(function(err, accounts) {
         accs = accounts;
         console.log("BSC accounts ",accounts);
         })
      console.log(calculatedValue);
      tx = await dexPoolContract.methods.swapDeposit(calculatedValue, accs[0]).send({from:vm.accountFrom});
      console.log(`tx.transactionHash ${tx.transactionHash}`);
      let receipt = await web3eth.eth.getTransactionReceipt(tx.transactionHash);
      if (receipt != null){
        console.log(receipt);
            document.querySelector("#swap").$.modal.close();
        disableSwapEnableAprove();
        } else {
          console.error("receipt null")
        }
        }
}


async function addLiquidity() {
    fetchDigiUtokenBalanace();
     dexPoolContract = await new web3bsc.eth.Contract(dexPoolABI, vm.dexPoolBSC[0].addr);
        console.log(`addLiquidity ${vm.amountLiqEth} ${vm.amountLiqBsc} vm.dexPoolETH.addr ${vm.dexPoolETH[0].addr} contract  ${dexPoolContract._address}`)
        let amountNet1 = calcToWei( vm.amountLiqBsc)
        let amountNet2 = calcToWei( vm.amountLiqEth)
    await web3eth.eth.getAccounts(function (err, accounts) {
            accs = accounts;
            console.log("ETH accounts ", accounts);
        })
        tx = await dexPoolContract.methods.addLiquidity(
            amountNet1,
            amountNet2,
            accs[0],
            vm.balanceLiqBsc
            ).send({from: vm.accountFrom}).on('transactionHash', hash => {
            console.log('TX Hash', hash)
        })
            .then(receipt => {
                console.log('Mined', receipt)
                if(receipt.status == '0x1' || receipt.status == 1){
                    console.log('Transaction Success')
                }
                else
                    console.log('Transaction Failed')
            })
            .catch( err => {
                console.error('Error', err)
            })
            .finally(() => {
                console.log('Extra Code After Everything')
            });
    fetchDigiUtokenBalanace();
}

//SWAP

  async function confirmSwapBSC() {
        dexPoolContract = await new web3bsc.eth.Contract(dexPoolABI, vm.dexPoolBSC[0].addr);
        console.log(`vm.dexPoolBSC.addr ${vm.dexPoolBSC[0].addr} contract  ${dexPoolContract._address}`)
        const tokenDecimals = await web3bsc.utils.toBN(18);
        const tokenAmountToApprove = await web3bsc.utils.toBN(1);
        console.log(tokenAmountToApprove.mul(web3bsc.utils.toBN(10).pow(tokenDecimals)));
        const calculatedValue = await web3bsc.utils.toHex(tokenAmountToApprove.mul(web3bsc.utils.toBN(10).pow(tokenDecimals)));

        await web3eth.eth.getAccounts(function(err, accounts) {
           accs = accounts;
           console.log("ETH accounts ",accounts);
           })
        console.log(calculatedValue);
        tx = await dexPoolContract.methods.swapDeposit(calculatedValue, accs[0]).send({from:vm.accountFrom});
        console.log(`tx.transactionHash ${tx.transactionHash}`);
        let receipt = await web3bsc.eth.getTransactionReceipt(tx.transactionHash);
        if (receipt != null){
          console.log(receipt);
          enableSwapDisableAprove();
          } else {
            console.error("receipt null")
          }
  }


function enableSwapDisableAprove(){
    document.querySelector("#swap").removeAttribute("disabled");
    document.querySelector("#approve").setAttribute("disabled", "disabled");
}

function disableSwapEnableAprove(){
  document.querySelector("#approve").removeAttribute("disabled");
  document.querySelector("#swap").setAttribute("disabled", "disabled");
}

function approveOnETHToken4AddLiquidity(){
    approveTransferToServiceContract(web3eth, vm.amountLiqEth, vm.tokensEth[0].addr, serviceContractEth, vm.accountEth);
}


async function getAllowance(tokenContract, serviceContract, account) {
    let qwe = 0;
      console.log(`getAllowance( ${tokenContract._address}, ${serviceContract}, ${account} )`);
      await tokenContract.methods.allowance(account, serviceContract).call().then(function (res) {
      console.log("tokenContract allowance", res, "token", tokenContract, "amountFrom", vm.amountFrom );
      if (res > qwe ) {
      enableSwapDisableAprove();
      } else {
      console.log("Allowance", res, "LESS THEN amountFrom", qwe );
      disableSwapEnableAprove();
      }
      return res;
      }).catch(e=>{  console.log(`getAllowance(${e})`);});
}


async function approveTransferToServiceContract(w3, amount, tokenContractAddr, serviceContract, accountFrom) {
    console.log("approveTransferToServiceContract  \n web3",w3);
    tokenContract = await new w3.eth.Contract(erc20abi,  tokenContractAddr);
    console.log(`approveTransferToServiceContract(amoun ${amount}\n, ${tokenContractAddr} tokenContract ${tokenContract._address}\n, serviceContract ${serviceContract}\n, from ${accountFrom} )`);
    const calculatedApproveValue = await calcToWei(amount);
      tx = await tokenContract.methods.approve(serviceContract, calculatedApproveValue).send({from:accountFrom});
      console.log(`tx.transactionHash ${tx.transactionHash}`);
      let receipt = await w3.eth.getTransactionReceipt(tx.transactionHash);
              if (receipt != null){
                  console.log(receipt);
                  document.querySelector("#swap").removeAttribute("disabled");
                  } else {
                    console.error("receipt null")
                  }
  getAllowance(tokenContract, serviceContract, accountFrom);
}

async function getAllAllowance() {
    fetchDigiUtokenBalanace();
  if (vm.chainFrom.id == '0x61'){
    tokenContract =  new web3bsc.eth.Contract(erc20abi, vm.tokensBsc[0].addr);
    serviceContract = serviceContractBsc
} else {
  console.log("vm.tokensEth[0]", vm.tokensEth[0].addr);
  tokenContract = new web3eth.eth.Contract(erc20abi, vm.tokensEth[0].addr);
  serviceContract = serviceContractEth

}
  return await getAllowance(tokenContract, serviceContract,  vm.accountFrom)
}


  //input only number
  function isNumberKey(evt,id,ft) {
  console.log(evt);
  console.log(document.getElementById(id).value)
    console.log(`isNumberKey(${evt},${id},${ft})`)
    var data = document.getElementById(id).value;
    if((evt.charCode>= 48 && evt.charCode <= 57) || evt.charCode== 46 ||evt.charCode == 0){
    if(data.indexOf('.') > -1 || data == ''){
     if(evt.charCode== 46)
      evt.preventDefault();
    }
    console.log("DATA", data);
    vm.amountFrom = data;
    } else evt.preventDefault();
  }
