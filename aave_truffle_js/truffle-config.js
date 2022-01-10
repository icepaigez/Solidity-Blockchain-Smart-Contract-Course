const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const mnemonic = process.env.MNEMONIC;
const kovanEndpoint = `wss://kovan.infura.io/ws/v3/${process.env.WEB3_INFURA_PROJECT_ID}`
const rinkebyEndpoint = `wss://rinkeby.infura.io/ws/v3/${process.env.WEB3_INFURA_PROJECT_ID}`
const etherscanToken = process.env.ETHERSCAN_TOKEN;
const maticEndPoint = `https://rpc-mumbai.maticvigil.com/v1/${process.env.MATIC_ID}`
const polygonscanToken = process.env.POLYGONSCAN_TOKEN

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic
          },
          providerOrUrl: kovanEndpoint
        })
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonic
          },
          providerOrUrl: rinkebyEndpoint
        })
      },
      gas: 4500000,
      gasPrice: 10000000000,
      network_id: 4
    },
    matic: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: mnemonic
        },
        providerOrUrl: maticEndPoint
      }),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    mainfork:{
      host: "127.0.0.1",
      port: 8545,
      network_id: 1,
    }
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './abis/',
  compilers: {
    solc: {
      version:"^0.6.0",
      optimizer: {
        enabled: true,
        runs: 200
      },
      // evmVersion: "petersburg"
    }
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: etherscanToken,
    polygonscan: polygonscanToken
  }
}
//ganache-cli --fork https://mainnet.infura.io/v3/infura -p 8545
