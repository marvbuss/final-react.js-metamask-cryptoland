import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const CryptolandsContext = React.createContext();

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
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
    const [connectWalletBtnTxt, setConnectWalletBtnTxt] =
        useState("Connect Wallet");
    const [formData, setFormData] = useState({
        address: "",
        amount: "",
        payment_reference: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const handleChange = ({ target }) => {
        setFormData((old) => ({
            ...old,
            [target.name]: target.value,
        }));
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [walletAddress]);

    const getAllTransfers = async () => {
        try {
            if (typeof window.ethereum !== "undefined") {
                const cryptolandContract = getEthereumContract();
                const allTransactions =
                    await cryptolandContract.getAllPayments();
                console.log(allTransactions);
                const hexNumber = 10 ** 18;
                const structuredTransactions = allTransactions.map(
                    (transaction) => ({
                        addressTo: transaction.receiver,
                        addressFrom: transaction.sender,
                        timestamp: new Date(
                            transaction.timestamp.toNumber() * 1000
                        ).toLocaleString("de-AT", { timeZone: "UTC" }),
                        payment_reference: transaction.payment_reference,
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

                    getAllTransfers();
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
            const { address, amount, payment_reference } = formData;
            const cryptolandContract = getEthereumContract();
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
                    cryptolandContract
                        .initiateTransfer(
                            address,
                            translateAmount,
                            payment_reference
                        )
                        .then((cryptolandContract) => {
                            console.log(cryptolandContract);
                            const cryptolandHash = cryptolandContract;

                            setIsLoading(true);
                            console.log(`Loading - ${cryptolandHash.hash}`);
                            cryptolandHash
                                .wait()
                                .then(() => {
                                    setIsLoading(false);
                                    console.log(
                                        `Success- ${cryptolandHash.hash}`
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
        <CryptolandsContext.Provider
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
        </CryptolandsContext.Provider>
    );
};
