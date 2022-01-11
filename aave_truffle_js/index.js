const IWeth = require("./abis/IWeth.json");
const ILendingPoolAddressesProvider = require("./abis/ILendingPoolAddressesProvider.json");
const ILendingPool = require("./abis/ILendingPool.json");
const AggregatorV3Interface = require("./abis/AggregatorV3Interface.json");
const Web3 = require("web3");
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();


const kovan = `https://kovan.infura.io/v3/${process.env.WEB3_INFURA_PROJECT_ID}`
const mnemonic = process.env.MNEMONIC;
const IWeth_ADDRESS = "0xd0a1e359811322d97991e03f863a0c30c2cf029c" //kovan
const ILendingPoolAddressesProvider_ADDRESS = "0x88757f2f99175387aB4C6a4b3067c77A695b0349"
const eth_dai_address = "0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541"//kovan
const DAI_ADDRESS = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD"//kovan
const amount = '100000000000000000' //0.1 weth

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

const approve_erc20 = async(spender, value, erc_abi, erc_address) => {
	const { account, web3 } = await init();
	const contract = new web3.eth.Contract(erc_abi, erc_address)
	let approve = await contract.methods.approve(spender, value).send({from: account})
	return approve
}

const get_lending_pool = async() => {
	const { web3 } = await init();
	const contract = new web3.eth.Contract(ILendingPoolAddressesProvider.abi, ILendingPoolAddressesProvider_ADDRESS)
	let pool_address = await contract.methods.getLendingPool().call()
	return pool_address
}

const aave_deposit = async() => {
	let lending_pool_address = await get_lending_pool()
	const { web3, account } = await init();
	if (lending_pool_address) {
		const lending_pool = new web3.eth.Contract(ILendingPool.abi, lending_pool_address)
		let approval = await approve_erc20(lending_pool_address, amount, IWeth.abi, IWeth_ADDRESS)
		if (approval.status) {
			let tx = await lending_pool.methods.deposit(IWeth_ADDRESS, amount, account, 0).send({from: account})
			console.log(tx)
		}
	}
}

const get_borrowable_data = async() => {
	let lending_pool, user_data, available_borrow_eth, total_collateral_eth, total_debt_eth, health_factor, amount_dai_to_borrow
	let lending_pool_address = await get_lending_pool()
	const { web3, account } = await init();
	if (lending_pool_address) {
		lending_pool = new web3.eth.Contract(ILendingPool.abi, lending_pool_address)
		user_data = await lending_pool.methods.getUserAccountData(account).call()
		const { 
			totalCollateralETH,
			totalDebtETH,
			availableBorrowsETH,
			currentLiquidationThreshold,
			ltv,
			healthFactor
		} = user_data;
		available_borrow_eth = web3.utils.fromWei(availableBorrowsETH, 'ether')
		total_collateral_eth = web3.utils.fromWei(totalCollateralETH, 'ether')
		total_debt_eth = web3.utils.fromWei(totalDebtETH, 'ether')
		health_factor = web3.utils.fromWei(healthFactor, 'ether')

		if (total_debt_eth < (0.75 * total_collateral_eth) ) {
			let dai_eth_price = await get_asset_price(eth_dai_address)
			amount_dai_to_borrow = (1 / dai_eth_price) * (available_borrow_eth * 0.95)
			if (amount_dai_to_borrow) {
				await lending_pool.methods.borrow(DAI_ADDRESS, web3.utils.toWei(String(amount_dai_to_borrow), 'ether'), 1, 0, account).send({from: account})
				// user_data = await lending_pool.methods.getUserAccountData(account).call()
				// console.log(user_data)
			}
		} else {
			
		}
	}
}

const repay_debt = async(amount, contract, lending_pool_address) => {
	
}

const get_asset_price = async(price_feed_address) => {
	const { web3 } = await init();
	const price_feed = new web3.eth.Contract(AggregatorV3Interface.abi, price_feed_address)
	let result = await price_feed.methods.latestRoundData().call()
	const { answer } = result
	let price = web3.utils.fromWei(answer)
	return price
}

//get_borrowable_data()
//repay_debt()
