async function main() {
    const Cryptoland = await hre.ethers.getContractFactory("Cryptoland");
    const cryptolands = await Cryptoland.deploy();

    await cryptolands.deployed();

    console.log("Cryptoland deployed to:", cryptolands.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
