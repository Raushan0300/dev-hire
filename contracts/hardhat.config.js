require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
    holesky: {
      url:`${process.env.ALCHEMY_HOLESKY_URL}`,
      accounts:[`${process.env.ACCOUNT_PRIVATE_KEY}`]
    }
  }
};
