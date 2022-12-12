require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
    },
    nextStep: {
      url: "http://127.0.0.1:8545",
      accounts: ["0x0cc0c2de7e8c30525b4ca3b9e0b9703fb29569060d403261055481df7014f7fa"],
    },
  },
  solidity: "0.8.17",
};
