const IWeth = require("./abis/IWeth.json");
const Web3 = require("web3");
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();


const rinkeby = `https://rinkeby.infura.io/v3/${process.env.WEB3_INFURA_PROJECT_ID}`
const mnemonic = process.env.MNEMONIC;
const IWeth_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab" //rinkeby


const init = async() => {
	let account;
	const provider = new HDWalletProvider({
		mnemonic: {
            phrase: mnemonic
          },
          providerOrUrl: rinkeby
	})
	const web3 = new Web3(provider)
	const contract = new web3.eth.Contract(IWeth.abi, IWeth_ADDRESS)
	let accounts = await web3.eth.getAccounts()
	account = accounts[0]

	let weth_balance = await contract.methods.balanceOf(account).call()
	if (web3.utils.fromWei(weth_balance, 'ether') < 0.1) { //deposit some eth for weth
		await contract.methods.deposit().send({from: account, value: web3.utils.toWei('0.1', 'ether')})
	}
	
	return {
		account, web3
	}
}

const get_lending_pool = async() => {
	const { account, web3 } = await init();
}

const aave_borrow = async() => {

}

//get_lending_pool()