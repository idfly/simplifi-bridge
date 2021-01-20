var vm = new Vue({
    el: '#app',
    data: {
      buttonEth: '...',
      buttonBsc: '...',
      accountEth: '',
      accountBsc: '',
      //Exchange tab
      ethChainId: '',
      bscChainId: '',
      tokenFrom: '',
      tokenTo: '',
      amountFrom: '',
      amountTo: '',
      chains: [{id:4, name:"Ethereum rinkeby", icon:"ethereum.png"}, {id:97, name:"BSC testnet", icon:"bsc.webp"}],
      balanceFrom:0.01,
      balanceTo:0.02,
      balanceLiqEth:0.1,
      balanceLiqBsc:0.1,
      tokensEth: [{symbol:"USDC",addr:"",icon:"usdc.webp",price:1},{symbol:"USDT",addr:"",icon:"tether.webp",price:1}], //price bypass
      tokensBsc: [{symbol:"USDC",addr:"",icon:"usdc.webp",price:1},{symbol:"USDT",addr:"",icon:"tether.webp",price:1},{symbol:"dLINK",addr:"",icon:"dlink.webp",price:0.1}],
      itemsFrom:{},
      itemsTo:{},
      //Liquidity tab
      amountLiqEth:'',
      amountLiqBsc:'',
      tokenLiqEth:'',
      tokenLiqBsc:'',
      price: 1,

    },
    watch: {
      
      amountFrom: function() {
        if (document.activeElement.id == 'num1' ) {
        calcAmount('from')
        }
      }, 
     
      amountTo: function() {
        if (document.activeElement.id == 'num2' ) {
        calcAmount('to')
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

setTimeout(checkInstall, 500);

var delta =360;
  function rotate360Deg(ele){
      ele.style.webkitTransform="rotate("+delta+"deg)";
      delta+=360;
      //rotate data
      let chain,balance,amount,token,items;
      chain = vm.chainTo; vm.chainTo = vm.chainFrom; vm.chainFrom = chain;
      balance = vm.balanceTo; vm.balanceTo = vm.balanceFrom; vm.balanceFrom = balance;
      items = vm.itemsTo; vm.itemsTo = vm.itemsFrom; vm.itemsFrom = items;
      token = vm.tokenTo; vm.tokenTo = vm.tokenFrom; vm.tokenFrom = token;
      amount = vm.amountTo; vm.amountTo = vm.amountFrom; vm.amountFrom = amount;

  }

function setTokenFrom(item) {
  vm.tokenFrom = item;
  //getBalanceFrom()
}

function setTokenTo(item) {
  vm.tokenTo = item;
  //getBalanceFrom()
}

function setLiqToken(item, typ) {
  if (typ == 'eth') {vm.tokenLiqEth = item;}
  else {vm.tokenLiqBsc = item;}
  
  //getBalanceFrom()
}


async function checkInstall() {
    if (window.ethereum) { 
        window.web3eth = new Web3(ethereum);
        vm.buttonEth = "Connect to Metamask";
    } else {vm.buttonEth = "Install Metamask"}

    if (window.BinanceChain) {
        window.web3bsc = new Web3(BinanceChain); 
        vm.buttonBsc = "Connect to Binance wallet";
    } else {vm.buttonBsc = "Install Binance wallet"}

}

//Ethereum wallet

async function connectEth() {
  if (vm.buttonEth == "Install Metamask") {window.open("https://metamask.io/download.html"); return}
 await ethereum.enable();
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

    refreshAccountDataEth()
    
  }

function refreshAccountDataEth() {
  (vm.accountEth != '') ? vm.buttonEth = vm.accountEth.substr(0,6) + '...' + vm.accountEth.substr(38) : vm.buttonEth = 'Connect to Metamask'
  

  }

   
// BSC wallet

async function connectBsc() {
  if (vm.buttonBsc == "Install Binance wallet") {window.open("https://docs.binance.org/smart-chain/wallet/binance.html"); return}
 //await BinanceChain.enable();
 const accountsBsc = await web3bsc.eth.getAccounts();
 vm.accountBsc = accountsBsc[0];
 onConnectBsc();
}

function onConnectBsc() {
    // Subscribe to accounts change
    BinanceChain.on("accountsChanged", (accounts) => {
      vm.accountBsc = accounts[0];
      refreshAccountDataBsc()
    });
   
    BinanceChain.on("chainChanged", (chainId) => {
      vm.bscChainId = chainId;
      refreshAccountDataBsc();
    });

    refreshAccountDataBsc()
   
  }

function refreshAccountDataBsc() {
    vm.buttonBsc = vm.accountBsc.substr(0,6) + '...' + vm.accountBsc.substr(38);
  
    }




