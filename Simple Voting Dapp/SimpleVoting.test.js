const { expect } = require("chai");
describe("SimpleVoting", function () {
    let SimpleVoting, voting, owner, addr1;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();
        SimpleVoting = await ethers.getContractFactory("SimpleVoting");
        voting = await SimpleVoting.deploy();
        await voting.deployed();
    });

    it("should allow owner to create proposal", async function () {
        await voting.createProposal("Proposal 1");
        const proposals = await ethers.getContractFactory("SimpleVoting");
        voting = await SimpleVoting.deploy();
        await voting.deployed();
    });

    it("should allow owner to create proposal", async function () {
        await voting.createProposal("Proposal 1");
        await voting.connect(addr1).vote(0);
        const proposals = await voting.getProposals();
        expect(proposals[0].voteCount).to.equal(1);
    });

    it("should allow user to vote", async function () {
        await voting.createProposal("Proposal 1");
        await voting.connect(addr1).vote(0);
        const proposals = await voting.getProposals();
        expect(proposals[0].voteCount).to.equal(1);
    });

    it("should not allow double voting", async function () {
        await voting.createProposal("Proposal 1");
        await voting.connect(addr1).vote(0);
        await expect(voting.connect(addr1).vote(0)).to.be.revertedWith("Already voted");
    });
});