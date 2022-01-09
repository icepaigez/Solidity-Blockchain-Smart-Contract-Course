const Lottery = artifacts.require("Lottery");

let priceFeedAddress, vrfCoordinator, link, keyHash, fee;

module.exports = async function (deployer, network) {
  if (network === 'development') {
    await deployer.deploy(Lottery);
  } else if (network === 'mainfork') {
    priceFeedAddress = "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"
    vrfCoordinator = "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952"
    link = "0x514910771AF9Ca656af840dff83E8264EcF986CA"
    keyHash = "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445"
    fee = "2000000000000000000" //2 LINK
    await deployer.deploy(Lottery, priceFeedAddress, vrfCoordinator, link, keyHash, fee);
  } else {//kovan
    priceFeedAddress = "0x9326BFA02ADD2366b30bacB125260Af641031331"
    vrfCoordinator = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
    link = "0xa36085F69e2889c224210F603D836748e7dC0088"
    keyHash = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
    fee = "100000000000000000" //0.1 LINK
    await deployer.deploy(Lottery, priceFeedAddress, vrfCoordinator, link, keyHash, fee);
  }
};