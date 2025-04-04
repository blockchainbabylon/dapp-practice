const hre = require("hardhat");

async function main() {
    const TipJar = await hre.ethers.getContractFactory("TipJar");
    const tipJar = await TipJar.deploy();
    await tipJar.deployed();
    console.log("TipJar deployed to:", tipJar.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
