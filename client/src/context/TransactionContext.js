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
    const [transactionCount, setTransactionCount] = useState(null);

    const handleChange = ({ target }) => {
        setFormData((old) => ({
            ...old,
            [target.name]: target.value,
        }));
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

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

                    // getAllTransactions();
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
                                    const transactionCount = transactionContract
                                        .getTransactionCount()
                                        .then((transactionCount) => {
                                            setTransactionCount(
                                                transactionCount.toNumber()
                                            );
                                        });
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
            }}
        >
            {children}
        </TransactionsContext.Provider>
    );
};
