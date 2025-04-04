const { expect } = require("chai");

describe("TipJar", function () {
    let TipJar, tipJar, owner, user;

    beforeEach(async () => {
        [owner, user] = await ethers.getSigners();
        TipJar = await ethers.getContractFactory("TipJar");
        tipJar = await TipJar.deploy();
        await tipJar.deployed();
    });

    it("should receive tips", async function () {
        await tipJar.connect(user).tip({ value: ethers.utils.parseEther("1") });
        const balance = await tipJar.getBalance();
        expect(balance).to.equal(ethers.utils.parseEther("1"));
    });

    it("should allow owner to withdraw", async function () {
        await tipJar.connect(user).tip({ value: ethers.utils.parseEther("1") });
        await expect(() => tipJar.connect(owner).withdraw())
            .to.changeEtherBalance(owner, ethers.utils.parseEther("1"));
    });

    it("should not allow non-owner to withdraw", async function () {
        await expect(tipejar.connect(user).withdraw()).to.be.revertedWith("Only owner can withdraw");
    });
});
