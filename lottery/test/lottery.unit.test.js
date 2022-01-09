//unit test is run against the dev network
//truffle test test/lottery.unit.test.js

const Lottery = artifacts.require("Lottery");

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
})
