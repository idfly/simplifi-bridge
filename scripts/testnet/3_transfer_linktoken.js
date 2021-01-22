const DexPool    = artifacts.require('DexPool')
const MyContract = artifacts.require('MyContract')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');


let env = require('dotenv').config({ path: `../../build/addrs_${process.argv[5]}.env` });


module.exports = async callback => {
try{
  LinkToken.setProvider(web3.currentProvider);

  

      let LINK_CONTRACT_ADDRESS   = null;
      let ORACLE_CONTRACT_ADDRESS = null;
      let DAI_ADDRESS             = null;

  if(process.argv[5] === 'rinkeby'){

      LINK_CONTRACT_ADDRESS   = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';
      ORACLE_CONTRACT_ADDRESS = '0x09008c3049784eD132bd076C083ad44091C9e55b';
      DAI_ADDRESS             = '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea';

  }

  if(process.argv[5] === 'binancetestnet'){

      LINK_CONTRACT_ADDRESS   = '0x88e69c0d2d924e642965f8dd151dd2e24ba154f8';
      ORACLE_CONTRACT_ADDRESS = '0x8c7864014b78b7126d2d5a01f604b5af910441bc';
      DAI_ADDRESS             = '0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867';

  }


      const myContract    = await MyContract.at(env.parsed.CLIENT_ADDRESS);
      const token         = await LinkToken.at(LINK_CONTRACT_ADDRESS);
      const tx            = await token.transfer(myContract.address, await web3.utils.toWei('1','Ether'), { from: (await web3.eth.getAccounts())[0] });

      console.log(`>>>>>>> TRANSFER LINK TOKEN TO MyContract: ${myContract.address} ON NETWORK ${process.argv[5]}\ntx:${tx.tx}\n\n`);
      console.log(`>>>>>>>>>>>>>  Balance MyContract: ${myContract.address} is: ${(await token.balanceOf(myContract.address)).toString()} LINK`);
  
}catch(e){console.log(e);}
  callback();
}
