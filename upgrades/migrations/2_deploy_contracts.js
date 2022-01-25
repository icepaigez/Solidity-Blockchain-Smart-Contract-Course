const Box = artifacts.require("Box");

module.exports = async function (deployer, network) {
  await deployer.deploy(Box);
  const box = await Box.deployed()
  let v = await box.getValue()
  console.log("the current value is", v.toString())
};
