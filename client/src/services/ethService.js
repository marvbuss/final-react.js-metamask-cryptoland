import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

const { ethereum } = window;
const hexNumberHelper = 10 ** 18;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const cryptolandContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    );

    return cryptolandContract;
};

const getTransactions = async () => {
    const cryptolandContract = getEthereumContract();
    const getAllPayments = await cryptolandContract.getAllPayments();
    const structuredTransfers = getAllPayments.map((payment) => ({
        addressTo: payment.receiver,
        addressFrom: payment.sender,
        timestamp: new Date(payment.timestamp.toNumber() * 1000).toLocaleString(
            "de-AT",
            { timeZone: "UTC" }
        ),
        payment_reference: payment.payment_reference,
        amount: parseInt(payment.amount._hex) / hexNumberHelper,
    }));

    return structuredTransfers.reverse();
};

const transfer = (walletAddress, formData, loadingCallback) => {
    const { address, amount, payment_reference } = formData;
    const cryptolandContract = getEthereumContract();
    const translateAmount = ethers.utils.parseEther(amount);

    ethereum
        .request({
            method: "eth_sendTransaction",
            params: [
                {
                    from: walletAddress,
                    to: address,
                    gas: "0x61A8", //25000 GWEI
                    value: translateAmount._hex,
                },
            ],
        })
        .then(() => {
            cryptolandContract
                .initiateTransfer(address, translateAmount, payment_reference)
                .then((cryptolandContract) => {
                    const cryptolandHash = cryptolandContract;

                    loadingCallback(true);
                    cryptolandHash.wait().then(() => {
                        loadingCallback(false);
                    });
                })
                .catch(console.log);
        });
};

export { getTransactions, transfer };
