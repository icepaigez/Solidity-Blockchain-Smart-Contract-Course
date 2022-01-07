const Lottery = artifacts.require("Lottery");

let priceFeedAddress;

module.exports = async function (deployer, network) {
  if (network === 'development') {
    await deployer.deploy(Lottery);
  } else if (network === 'mainfork') {
    await deployer.deploy(Lottery, "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419");
  } else {
    priceFeedAddress = 0x9326BFA02ADD2366b30bacB125260Af641031331
    await deployer.deploy(Lottery, priceFeedAddress);
  }
};