import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const CryptolandsContext = React.createContext();

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

export const CryptolandProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [metaMask, setMetaMask] = useState(null);
    const [formData, setFormData] = useState({
        address: "",
        amount: "",
        payment_reference: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [transfers, setTransfers] = useState([]);

    const handleChange = ({ target }) => {
        setFormData((old) => ({
            ...old,
            [target.name]: target.value,
        }));
    };

    const checkIfMetaMaskIsInstalled = () => {
        if (typeof ethereum == "undefined") {
            return setMetaMask(false);
        } else {
            return setMetaMask(true);
        }
    };

    const checkIfWalletIsConnected = () => {
        if (typeof ethereum == "undefined") return setMetaMask(false);
        ethereum
            .request({
                method: "eth_accounts",
            })
            .then((result) => {
                if (result.length) {
                    walletChangedHandler(result[0]);
                } else {
                    console.log("No connected account");
                }
            })
            .catch(console.log);
    };

    useEffect(() => {
        checkIfMetaMaskIsInstalled();
    }, []);

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const getAllTransfers = async () => {
        try {
            if (typeof ethereum == "undefined") return setMetaMask(false);
            const cryptolandContract = getEthereumContract();
            const getAllPayments = await cryptolandContract.getAllPayments();
            const structuredTransfers = getAllPayments.map((payment) => ({
                addressTo: payment.receiver,
                addressFrom: payment.sender,
                timestamp: new Date(
                    payment.timestamp.toNumber() * 1000
                ).toLocaleString("de-AT", { timeZone: "UTC" }),
                payment_reference: payment.payment_reference,
                amount: parseInt(payment.amount._hex) / hexNumberHelper,
            }));
            structuredTransfers.reverse();
            setTransfers(structuredTransfers);
        } catch (err) {
            console.log(err);
        }
    };

    const connectWalletHandler = () => {
        if (typeof ethereum == "undefined") return setMetaMask(false);
        ethereum
            .request({ method: "eth_requestAccounts" })
            .then((result) => {
                //result gives back an array of accounts
                walletChangedHandler(result[0]);
            })
            .catch(console.log);
    };

    const walletChangedHandler = (wallet) => {
        setWalletAddress(wallet);
        walletBalanceHandler(wallet.toString());
    };

    const walletBalanceHandler = (wallet) => {
        ethereum
            .request({ method: "eth_getBalance", params: [wallet, "latest"] })
            .then((result) => {
                setWalletBalance(ethers.utils.formatEther(result));
                getAllTransfers();
            })
            .catch(console.log);
    };

    const initiateTransferHandler = () => {
        if (typeof ethereum == "undefined") return setMetaMask(false);
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
                    .initiateTransfer(
                        address,
                        translateAmount,
                        payment_reference
                    )
                    .then((cryptolandContract) => {
                        const cryptolandHash = cryptolandContract;

                        setIsLoading(true);
                        cryptolandHash
                            .wait()
                            .then(() => {
                                setIsLoading(false);
                            })
                            .then(() => {
                                window.location.reload();
                            });
                    })
                    .catch(console.log);
            });
    };

    const chainChangedHandler = () => {
        window.location.reload();
    };

    ethereum.on("accountsChanged", connectWalletHandler);
    ethereum.on("chainChanged", chainChangedHandler);

    return (
        <CryptolandsContext.Provider
            value={{
                walletAddress,
                walletBalance,
                metaMask,
                formData,
                transfers,
                isLoading,
                handleChange,
                connectWalletHandler,
                initiateTransferHandler,
            }}
        >
            {children}
        </CryptolandsContext.Provider>
    );
};
