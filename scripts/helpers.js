const { ethers } = require("ethers");
const { getContractAt } = require("@nomiclabs/hardhat-ethers/internal/helpers");


// Helper method for fetching environment variables from .env
function getEnvVariable(key, defaultValue) {
    if (process.env[key]) {
        return process.env[key];
    }
    if (!defaultValue) {
        throw `${key} is not defined and no default value was provided`;
    }
    return defaultValue;
}

// Helper method for fetching a connection provider to the Ethereum network
function getProvider() {
    return ethers.getDefaultProvider("rinkeby", {
        alchemy: 'daEDcVO3uAY1AOh0U5RS6_Q7V8aYh7OT',
    });
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getAccount() {
    return new ethers.Wallet('8e9866a79a786878dfe09bb564345d29024878918126c1348e4453160c71b4f8', getProvider());
}

// Helper method for fetching a contract instance at a given address
function getContract(contractName, hre) {
    const account = getAccount();
    // return getContractAt(hre, contractName, getEnvVariable("NFT_CONTRACT_ADDRESS"), account);
    return getContractAt(hre, contractName, process.env.contactAddress, account);
}

module.exports = {
    getEnvVariable,
    getProvider,
    getAccount,
    getContract,
}