require("@nomiclabs/hardhat-waffle");

module.exports = {
    solidity: "0.8.0",
    networks: {
        ropsten: {
            url: "https://eth-ropsten.alchemyapi.io/v2/oK9HBFc3I7WB4zyQi-8UdV_4l9vTvMPa",
            accounts: [
                "a241ba45fd036ae54bb2e71cf1c18807656067d7369a5761670760eddc6d81f2",
            ],
        },
    },
};
