const SimpleCollectible = artifacts.require("SimpleCollectible");

const sample_token_uri = "https://ipfs.io/ipfs/Qmd9MCGtdVz2miNumBHDbvj8bigSgTwnr4SbyH6DNnpWdt?filename=0-PUG.json"
let OPEN_SEA_URL;

module.exports = async function (deployer, network) {
  await deployer.deploy(SimpleCollectible);
  const simple_collectible = await SimpleCollectible.deployed();

  let tx = await simple_collectible.createCollectible(sample_token_uri)
  let counter = await simple_collectible.tokenCounter();
  counter = counter.toString()
  OPEN_SEA_URL = `https://testnets.opensea.io/assets/${simple_collectible.address}/${counter}`
  console.log("you can see your NFT at", OPEN_SEA_URL)
};
