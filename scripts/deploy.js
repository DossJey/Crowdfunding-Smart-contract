
const hre = require("hardhat");
const { ethers } = require("ethers");

async function main() {
 
 const Crowdfund = await  hre.ethers.getContractFactory("Crowdfund");
 const crowdfund = await Crowdfund.deploy();

  await crowdfund.waitForDeployment();

  console.log("contract deployed!",await crowdfund.getAddress());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
