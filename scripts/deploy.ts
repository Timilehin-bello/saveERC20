import { ethers } from "hardhat";

async function main() {
  const Erc20 = await ethers.deployContract("Token", [
    "Tibello",
    "TI",
    "18",
    "1000000",
  ]);
  await Erc20.waitForDeployment();

  const SaveERC20 = await ethers.deployContract("SaveERC20", [Erc20.target]);

  await SaveERC20.waitForDeployment();

  console.log(
    `ERC20 address ${Erc20.target} SaveERC20 address ${SaveERC20.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
