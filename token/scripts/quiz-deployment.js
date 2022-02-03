const hre = require("hardhat");


async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // We get the contract to deploy
    const Quiz = await hre.ethers.getContractFactory("Quiz");
    const quiz = await Quiz.deploy(1000);

    await quiz.deployed();

    console.log("$QUIZ deployed to:", quiz.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
