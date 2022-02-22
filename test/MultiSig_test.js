const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("MultiSig Wallet", function () {

    let owner;
    let owner2;
    let owner3;
    let MultiSig;
    let sig;


    before(async function () {
        [owner, owner2, owner3, ...addrs] = await ethers.getSigners();
        MultiSig = await ethers.getContractFactory("MultiSig")
        sig = await MultiSig.deploy([owner.address, owner2.address], 2);
        await sig.deployed();
    })

    describe("MultiSig Tests", function () {
        it("Should deploy the wallet and send funds to it", async function () {
            const txHash = await owner.sendTransaction({
                to: sig.address,
                value: ethers.utils.parseEther("1.0")
              });

            const provider = waffle.provider;
            const WalletBalance = await provider.getBalance(sig.address);

            expect(WalletBalance).to.equal(ethers.utils.parseEther("1.0"));
        })

        it("Should create transaction", async function () {
            await sig.createTransaction(owner3.address, ethers.utils.parseEther("0.5"));

            await expect(sig.createTransaction(owner3.address, ethers.utils.parseEther("0.5")))
                .to.emit(sig, "CreateTransaction")
                .withArgs(owner3.address, ethers.utils.parseEther("0.5"), 1);
        });

        it("Should approve the transaction", async function () {
            await sig.connect(owner).approveTransaction(0);
            await sig.connect(owner2).approveTransaction(0);
            
            expect(await sig.approved(0, owner.address)).to.equal(true);
            expect(await sig.approved(0, owner2.address)).to.equal(true);
        });

        it("Should execute the transaction", async function () {
            const prov = waffle.provider;            
            await sig.connect(owner).executeTransaction(0);
            
            const bal = await prov.getBalance(sig.address);
            const balOfOwner3 = await prov.getBalance(owner3.address);

            expect(bal).to.equal(ethers.utils.parseEther("0.5"));
            expect(balOfOwner3).to.equal(ethers.utils.parseEther("10000.5"))
        });
    });
});

