const hre = require("hardhat");

async function main() {
    const SimpleVoting = await hre.ethers.getContractFactory("SimpleVoting");
    const voting = await SimpleVoting.deploy();
    await voting.deployed();

    console.log("SimpleVoting deployed to:", voting.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});