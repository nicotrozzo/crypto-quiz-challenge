require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/UULcAJv2MWwJ00Wkm8H5gkb_lwg4AtoX',
      accounts: [`1a17c3b6087917815798ac06d49c241b1fc878c9501e5a68b7589701749d1237`]
    }
  }
};
