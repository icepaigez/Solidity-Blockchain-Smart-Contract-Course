const Lottery = artifacts.require("Lottery");
const MockV3Aggregator = artifacts.require("MockV3Aggregator");
const VRFCoordinatorMock = artifacts.require("VRFCoordinatorMock");
const LinkToken = artifacts.require("LinkToken");

let priceFeedAddress, vrfCoordinator, link, keyHash, fee;
const decimals = 8
const initialValue = 200000000000
const amount = 10**27;
const initialSupply = "0x"+amount.toString(16)

module.exports = async function (deployer, network) {
  if (network === 'development') {
    await deployer.deploy(MockV3Aggregator, decimals, initialValue);
    const mock_aggregator = await MockV3Aggregator.deployed();
    priceFeedAddress = mock_aggregator.address;

    await deployer.deploy(LinkToken, initialSupply);
    const link_token = await LinkToken.deployed();
    link_address = link_token.address;

    await deployer.deploy(VRFCoordinatorMock, link_address);
    const vrf_coord = await VRFCoordinatorMock.deployed();
    vrf_address = vrf_coord.address;
    fee = "100000000000000000" //0.1 LINK
    keyHash = "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445"
    await deployer.deploy(Lottery, priceFeedAddress, vrf_address, link_address, keyHash, fee);
  } else if (network === 'mainfork') {
    priceFeedAddress = "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"
    vrfCoordinator = "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952"
    link = "0x514910771AF9Ca656af840dff83E8264EcF986CA"
    keyHash = "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445"
    fee = "2000000000000000000" //2 LINK
    await deployer.deploy(Lottery, priceFeedAddress, vrfCoordinator, link, keyHash, fee);
  } else if (network === 'kovan') {//kovan
    priceFeedAddress = "0x9326BFA02ADD2366b30bacB125260Af641031331"
    vrfCoordinator = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9"
    link = "0xa36085F69e2889c224210F603D836748e7dC0088"
    keyHash = "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4"
    fee = "100000000000000000" //0.1 LINK
    await deployer.deploy(Lottery, priceFeedAddress, vrfCoordinator, link, keyHash, fee);
  } else {//rinkeby
    priceFeedAddress = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"
    vrfCoordinator = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B"
    link = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709"
    keyHash = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311"
    fee = "100000000000000000" //0.1 LINK
    await deployer.deploy(Lottery, priceFeedAddress, vrfCoordinator, link, keyHash, fee);
  }
};

//https://rinkeby.etherscan.io/address/0xf274bdF573Ed8B045EF2Ed0466c264aE06840528#code