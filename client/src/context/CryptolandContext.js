import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const CryptolandsContext = React.createContext();

const { ethereum } = window;

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
    const [isConnecting, setIsConnecting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [transfers, setTransfers] = useState([]);

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
        if (typeof ethereum == "undefined") return setMetaMask(false);

        ethereum
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

    const getAllTransfers = async () => {
        try {
            if (typeof ethereum !== "undefined") {
                const cryptolandContract = getEthereumContract();
                const getAllPayments =
                    await cryptolandContract.getAllPayments();
                const hexNumber = 10 ** 18;
                const structuredTransfers = getAllPayments.map((payment) => ({
                    addressTo: payment.receiver,
                    addressFrom: payment.sender,
                    timestamp: new Date(
                        payment.timestamp.toNumber() * 1000
                    ).toLocaleString("de-AT", { timeZone: "UTC" }),
                    payment_reference: payment.payment_reference,
                    amount: parseInt(payment.amount._hex) / hexNumber,
                }));
                setTransfers(structuredTransfers);
            } else {
                setMetaMask(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const connectWalletHandler = () => {
        if (typeof ethereum !== "undefined") {
            ethereum
                .request({ method: "eth_requestAccounts" })
                .then((result) => {
                    //result gives back an array of accounts
                    walletChangedHandler(result[0]);
                })
                .catch(console.log);
        } else {
            setMetaMask(false);
        }
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
            })
            .catch(console.log);
    };

    const initiateTransferHandler = () => {
        if (typeof ethereum !== "undefined") {
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
            setMetaMask(false);
        }
    };

    const chainChangedHandler = () => {
        window.location.reload();
    };

    ethereum.on("accountsChanged", walletChangedHandler);
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
