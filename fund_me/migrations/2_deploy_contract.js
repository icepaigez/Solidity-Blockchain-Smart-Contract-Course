const FundMe = artifacts.require("FundMe");

module.exports = async function (deployer, network) {
  await deployer.deploy(FundMe);
};
