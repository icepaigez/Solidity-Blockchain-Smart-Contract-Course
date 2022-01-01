const SimpleStorage = artifacts.require("SimpleStorage");

contract("SimpleStorage", async accounts => {

	let instance;
	beforeEach("should set up the contract instance", async() => {
		instance = await SimpleStorage.deployed();
	})

	describe("Opening Balance", async() => {
		it ("it should have an opening favoriteNumber balance of zero", async() => {
			const starting_value = await instance.retrieve(); //BN Object returned
			assert.equal(starting_value.toNumber(), 0) 
		})
	})

	describe("Updated Balance", async() => {
		it("should update the favoriteNumber variable to the amount provided", async() => {
			const tx = await instance.setFavoriteNumber(25);
			const new_value = await instance.retrieve();
			assert.equal(new_value.toNumber(), 25);
		})
	})		
})