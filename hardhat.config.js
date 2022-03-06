/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("./scripts/deploy.js");
require("./scripts/mint.js");

// const { ALCHEMY_KEY, ACCOUNT_PRIVATE_KEY } = process.env;

module.exports = {
   solidity: "0.8.1",
   defaultNetwork: "rinkeby",
   networks: {
    hardhat: {},
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${'daEDcVO3uAY1AOh0U5RS6_Q7V8aYh7OT'}`,
      accounts: [`0x${'8e9866a79a786878dfe09bb564345d29024878918126c1348e4453160c71b4f8'}`]
    },
    ethereum: {
      chainId: 1,
      url: `https://eth-mainnet.alchemyapi.io/v2/${'daEDcVO3uAY1AOh0U5RS6_Q7V8aYh7OT'}`,
      accounts: [`0x${'8e9866a79a786878dfe09bb564345d29024878918126c1348e4453160c71b4f8'}`]
    },
  },
}