import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionsContext = React.createContext();

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    );

    return transactionContract;
};

export const TransactionProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [connectWalletBtnTxt, setConnectWalletBtnTxt] =
        useState("Connect Wallet");
    const [formData, setFormData] = useState({
        address: "",
        amount: "",
        keyword: "",
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const handleChange = ({ target }) => {
        setFormData((old) => ({
            ...old,
            [target.name]: target.value,
        }));
    };

    const getAllTransactions = async () => {
        try {
            if (typeof window.ethereum !== "undefined") {
                const transactionContract = getEthereumContract();
                const allTransactions =
                    await transactionContract.getAllTransactions();
                console.log(allTransactions);
                const hexNumber = 10 ** 18;
                const structuredTransactions = allTransactions.map(
                    (transaction) => ({
                        addressTo: transaction.receiver,
                        addressFrom: transaction.sender,
                        timestamp: new Date(
                            transaction.timestamp.toNumber() * 1000
                        ).toLocaleString("de-AT", { timeZone: "UTC" }),
                        message: transaction.message,
                        amount: parseInt(transaction.amount._hex) / hexNumber,
                    })
                );
                console.log(structuredTransactions);
                setTransactions(structuredTransactions);
            } else {
                setConnectWalletBtnTxt("Please install MetaMask");
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [walletAddress]);

    const checkIfWalletIsConnected = () => {
        if (typeof window.ethereum == "undefined")
            return setConnectWalletBtnTxt("Please install MetaMask.");

        window.ethereum
            .request({
                method: "eth_accounts",
            })
            .then((result) => {
                if (result.length) {
                    setWalletAddress(result[0]);

                    getAllTransactions();
                } else {
                    console.log("No accounts found");
                }
            })
            .catch(console.log);
    };

    const connectWalletHandler = () => {
        if (typeof window.ethereum !== "undefined") {
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((result) => {
                    //result gives back an array of accounts
                    walletChangedHandler(result[0]);
                })
                .catch(console.log);
        } else {
            setConnectWalletBtnTxt("Please install MetaMask");
        }
    };

    const walletChangedHandler = (wallet) => {
        setWalletAddress(wallet);
        walletBalanceHandler(wallet.toString());
    };

    const walletBalanceHandler = (wallet) => {
        window.ethereum
            .request({ method: "eth_getBalance", params: [wallet, "latest"] })
            .then((result) => {
                setWalletBalance(ethers.utils.formatEther(result));
            })
            .catch(console.log);
    };

    const chainChangedHandler = () => {
        window.location.reload();
    };

    window.ethereum.on("accountsChanged", walletChangedHandler);
    window.ethereum.on("chainChanged", chainChangedHandler);

    const sendTransaction = () => {
        if (typeof window.ethereum !== "undefined") {
            const { address, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const translateAmount = ethers.utils.parseEther(amount);

            window.ethereum
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
                    transactionContract
                        .addToBlockchain(
                            address,
                            translateAmount,
                            message,
                            keyword
                        )
                        .then((transactionContract) => {
                            console.log(transactionContract);
                            const transactionHash = transactionContract;

                            setIsLoading(true);
                            console.log(`Loading - ${transactionHash.hash}`);
                            transactionHash
                                .wait()
                                .then(() => {
                                    setIsLoading(false);
                                    console.log(
                                        `Success- ${transactionHash.hash}`
                                    );
                                })
                                .then(() => {
                                    window.location.reload();
                                });
                        })
                        .catch(console.log);
                });
        } else {
            setConnectWalletBtnTxt("Please install MetaMask");
        }
    };

    return (
        <TransactionsContext.Provider
            value={{
                walletAddress,
                walletBalance,
                connectWalletBtnTxt,
                connectWalletHandler,
                formData,
                handleChange,
                sendTransaction,
                transactions,
                isLoading,
            }}
        >
            {children}
        </TransactionsContext.Provider>
    );
};
