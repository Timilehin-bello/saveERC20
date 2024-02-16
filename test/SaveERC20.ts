import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { expect } from "chai";

describe("SaveERC20", function () {
  let SaveERC20: any;
  let owner: Signer;
  let user: any;
  let savingToken: any;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const SaveERC20Factory = await ethers.getContractFactory("SaveERC20");
    SaveERC20 = await ethers.deployContract("Token", [
      "Tibello",
      "TI",
      "18",
      "1000000",
    ]);

    // Deploy a mock ERC20 token
    const ERC20MockFactory = await ethers.getContractFactory("Token");
    savingToken = await ERC20MockFactory.deploy(
      "Tibello",
      "TI",
      "18",
      "1000000"
    );
  });

  it("Should deposit and withdraw tokens", async function () {
    const depositAmount = ethers.parseEther("100");

    // User approves SaveERC20 to spend tokens
    await savingToken.connect(user).approve(SaveERC20.target, depositAmount);

    // User deposits tokens
    await SaveERC20.connect(user).deposit(depositAmount);

    // Check user balance
    expect(await SaveERC20.checkUserBalance(user.address)).to.equal(
      depositAmount
    );

    // Check contract balance
    expect(await SaveERC20.checkContractBalance()).to.equal(depositAmount);

    // User withdraws tokens
    await SaveERC20.connect(user).withdraw(depositAmount);

    // Check user balance after withdrawal
    expect(await SaveERC20.checkUserBalance(user.address)).to.equal(0);

    // Check contract balance after withdrawal
    expect(await SaveERC20.checkContractBalance()).to.equal(0);
  });

  it("Should allow the owner to withdraw tokens from the contract", async function () {
    const depositAmount = ethers.parseEther("100");

    // User approves SaveERC20 to spend tokens
    await savingToken.connect(user).approve(SaveERC20.address, depositAmount);

    // User deposits tokens
    await SaveERC20.connect(user).deposit(depositAmount);

    // Owner withdraws tokens from the contract
    await SaveERC20.connect(owner).ownerWithdraw(depositAmount);

    // Check contract balance after owner withdrawal
    expect(await SaveERC20.checkContractBalance()).to.equal(0);
  });
});
