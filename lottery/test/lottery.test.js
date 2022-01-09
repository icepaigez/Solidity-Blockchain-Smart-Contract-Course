const Lottery = artifacts.require("Lottery");

contract("Lottery", accounts => {
	let instance;
	beforeEach("should set up a contract instance", async() => {
		instance = await Lottery.deployed();
	})

	describe("getEntranceFee", async() => {
		it("should return the minimum lottery entrance fee", async() => {
			const entranceFee = await instance.getEntranceFee();
			assert.ok(web3.utils.fromWei(entranceFee.toString()) < '0.014')
		})
	})
})
