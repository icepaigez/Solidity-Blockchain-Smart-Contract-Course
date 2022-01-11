const IWeth = require("./abis/IWeth.json");
const ILendingPoolAddressesProvider = require("./abis/ILendingPoolAddressesProvider.json");
const ILendingPool = require("./abis/ILendingPool.json");
const Web3 = require("web3");
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();


const kovan = `https://kovan.infura.io/v3/${process.env.WEB3_INFURA_PROJECT_ID}`
const mnemonic = process.env.MNEMONIC;
const IWeth_ADDRESS = "0xd0a1e359811322d97991e03f863a0c30c2cf029c" //kovan
const ILendingPoolAddressesProvider_ADDRESS = "0x88757f2f99175387aB4C6a4b3067c77A695b0349"


const init = async() => {
	let account;
	const provider = new HDWalletProvider({
		mnemonic: {
            phrase: mnemonic
          },
          providerOrUrl: kovan
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
	const { web3 } = await init();
	const contract = new web3.eth.Contract(ILendingPoolAddressesProvider.abi, ILendingPoolAddressesProvider_ADDRESS)
	let pool_address = await contract.methods.getLendingPool().call()
	return pool_address
}

const aave_borrow = async() => {
	let lending_pool_address = await get_lending_pool()
	const { web3 } = await init();
	if (lending_pool_address) {
		const contract = new web3.eth.Contract(ILendingPool.abi, lending_pool_address)
		console.log(contract)
	}
}

//aave_borrow()