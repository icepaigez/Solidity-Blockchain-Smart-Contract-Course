//unit test is run against the dev network
//truffle test test/lottery.unit.test.js

const Lottery = artifacts.require("Lottery");
const truffleAssert = require('truffle-assertions');

contract("Lottery", accounts => {
	let instance;
	beforeEach("should set up a contract instance", async() => {
		instance = await Lottery.deployed();
	})

	describe("getEntranceFee", async() => {
		it("should return the minimum lottery entrance fee", async() => {
			const entranceFee = await instance.getEntranceFee();
			assert.equal(web3.utils.fromWei(entranceFee.toString()),  '0.025')
		})
	})

	describe("Lottery State", async() => {
		//OPEN=0, CLOSED=1. CALCULATING_WINNER=2
		it("should ensure that the lottery state is closed by default", async() => {
			const status = await instance.lottery_state();
			assert.equal(status.toString(), 1);
		})

		it("should start the lottery on the start function call", async() => {
			await instance.startLottery();
			const status = await instance.lottery_state();
			assert.equal(status.toString(), 0)
		})
	})

	describe("Enter Lottery", async() => {
		it("should accept a lottery entrance payment greater than entrance fee", async() => {
			const tx = await instance.enter({from: accounts[1], value:web3.utils.toWei('1')})
			const bal = await web3.eth.getBalance(instance.address)
			assert.equal(bal, web3.utils.toWei('1'))
		})
	})
})
