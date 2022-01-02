const FundMe = artifacts.require("FundMe");
const MockV3Aggregator = artifacts.require("MockV3Aggregator");

let priceFeedAddress;
const decimals = 18
const initialValue = 2000*10**18

module.exports = async function (deployer, network) {

  if (network !== 'development') {
    priceFeedAddress = 0x9326BFA02ADD2366b30bacB125260Af641031331
    await deployer.deploy(FundMe, priceFeedAddress);
  } else {
    await deployer.deploy(MockV3Aggregator, decimals, initialValue);
    const mock_aggregator = await MockV3Aggregator.deployed();
    priceFeedAddress = mock_aggregator.address;
    console.log(priceFeedAddress)
    await deployer.deploy(FundMe, priceFeedAddress);
  }
};
