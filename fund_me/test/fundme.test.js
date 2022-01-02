const FundMe = artifacts.require("FundMe");

contract("FundMe", accounts => {

	let instance;
	beforeEach("should set up the contract instance", async() => {
		instance = await FundMe.deployed()
	})

	describe("Opening Balance", async() => {
		it("should have an opening balance of 0", async() => {
			const openingBalance = await web3.eth.getBalance(instance.address);
			assert.equal(openingBalance, 0);
		})
	})

	describe.only("Fund Contract", async() => {
		it("should increase the contract balance after getting funds", async() => {
			await instance.fund({from:accounts[2], value: web3.utils.toWei('1.5', 'ether')});
			let currentBalance = await await web3.eth.getBalance(instance.address)
			assert.equal(currentBalance, web3.utils.toWei('1.5', 'ether'))
		})

		it("should clear the contract balance when withdraw is done", async() => {
			await instance.withdraw();
			let newBalance = await await web3.eth.getBalance(instance.address)
			assert.equal(newBalance, 0)
		})
	})
})