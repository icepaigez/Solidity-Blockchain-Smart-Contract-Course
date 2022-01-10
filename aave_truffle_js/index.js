const IWeth = require("./abis/IWeth.json");
const Web3 = require("web3");
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();


const rinkeby = `https://rinkeby.infura.io/v3/${process.env.WEB3_INFURA_PROJECT_ID}`
const mnemonic = process.env.MNEMONIC;
const IWeth_ADDRESS = "0xc778417e063141139fce010982780140aa0cd5ab" //rinkeby


const init = async() => {
	const provider = new HDWalletProvider({
		mnemonic: {
            phrase: mnemonic
          },
          providerOrUrl: rinkeby
	})
	const web3 = new Web3(provider)
	const contract = new web3.eth.Contract(IWeth.abi, IWeth_ADDRESS)
	console.log(contract)
}

//init()