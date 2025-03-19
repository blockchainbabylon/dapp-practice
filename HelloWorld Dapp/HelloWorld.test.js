const { expect } = require("chai");

describe("HelloWorld", function () {
    let helloWorld;

    beforeEach(async function () {
        const HelloWorld = await ethers.getContractFactory("HelloWorld");
        helloWorld = await HelloWorld.deploy();
        await helloWorld.deployed();
    });

    it("should return the default message", async function () {
        expect(await helloWorld.getMessage()).to.equal("Hello, Blockchain!");
    });

    it("Should update the message", async function () {
        await helloWorld.setMessage("Good Morning, World!");
        expect(await helloWorld.getMessage()).to.equal("Good Morning, World!");
    });
})