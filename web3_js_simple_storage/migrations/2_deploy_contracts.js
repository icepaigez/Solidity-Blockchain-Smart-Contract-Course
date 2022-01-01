const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = async function (deployer, network) {
  await deployer.deploy(SimpleStorage);

  const simple_storage = await SimpleStorage.deployed();
};
