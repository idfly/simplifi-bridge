var vm = new Vue({
    el: '#app',
    data: {
      buttonEth: '...',
      buttonBsc: '...',
      accountEth: '',
      accountBsc: '',
      ethChainId: '',
      bscChainId: '',
      tokenFrom: 'Select token',
    
    }
  })

setTimeout(checkInstall, 500);

async function checkInstall() {
    if (window.ethereum) { 
        window.web3eth = new Web3(ethereum);
        vm.buttonEth = "Connect Ethereum";
    } else {vm.buttonEth = "Install Metamask"}

    if (window.BinanceChain) {
        window.web3bsc = new Web3(BinanceChain); 
        vm.buttonBsc = "Connect Binance";
    } else {vm.buttonBsc = "Install Binance"}
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
  (vm.accountEth != '') ? vm.buttonEth = vm.accountEth.substr(0,6) + '...' + vm.accountEth.substr(38) : vm.buttonEth = 'Connect Ethereum'
  

  }

   
// BSC wallet

async function connectBsc() {
  if (vm.buttonEth == "Install Binance") { alert(0); window.open("https://docs.binance.org/smart-chain/wallet/binance.html"); return}
 //await BinanceChain.enable();
 const accountsBsc = await web3bsc.eth.getAccounts();
 vm.accountBsc = accountsBsc[0];
 onConnectBsc();
}

function onConnectBsc() {
    // Subscribe to accounts change
    BinanceChain.on("accountsChanged", (accounts) => {alert('2'+accounts);
      vm.accountBsc = accounts[0];
      refreshAccountDataBsc()
    });
   
    BinanceChain.on("chainChanged", (chainId) => {alert(chainId);
      vm.bscChainId = chainId;
      refreshAccountDataBsc();
    });

    refreshAccountDataBsc()
   
  }

function refreshAccountDataBsc() {
    vm.buttonBsc = vm.accountBsc.substr(0,6) + '...' + vm.accountBsc.substr(38);
  
    }




