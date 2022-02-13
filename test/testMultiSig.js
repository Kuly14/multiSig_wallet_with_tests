const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("MultiSig Contract", function () {

  let owner;
  let owner2;
  let recipient;
  let MultiSig;
  let sig;
  let addrs;

})

beforeEach("Deploy", async function () {
  [owner, owner2, recipient, ...addrs] = await ethers.getSigners();
  MultiSig = await hre.ethers.getContractFactory("MultiSig");
  sig = await MultiSig.deploy([owner.address, owner2.address], 2);
  await sig.deployed();
})

describe("Deployment", async function () {

  it("Should deploy multiSig successfuly", async function () {
    expect(sig.address);
  }),

  it("Should send money to the contract", async function () {
    const tranasctionHash = await owner.sendTransaction({
      to: sig.address,
      value: ethers.utils.parseEther("1.0")
    })
    const provider = waffle.provider;
    const balance = await provider.getBalance(sig.address);
    expect(balance == ethers.utils.parseEther("1.0"));
  }),  

  it("Should create a transaction", async function () {
    await sig.createTransaction(recipient.address, ethers.utils.parseEther("1.0"))
    await sig.connect(owner2).createTransaction(recipient.address, ethers.utils.parseEther("1.0"));
  
    expect(await sig.createTransaction(recipient.address, ethers.utils.parseEther("1.0")))
      .to.emit(sig, 'CreateTransaction')
      .withArgs(recipient.address, ethers.utils.parseEther("1.0"), 2);
  
  }),

  it("Should approve the transaction successfuly", async function () {
    await sig.connect(owner).approveTransaction(1);

  })

  it("Should approve the transaction from different account", async function () {
    await sig.connect(owner2).approveTransaction(1);
  })

  it("Should execute the transaction", async function () {
    await sig.executeTransaction(2);
  })

})

  
  




