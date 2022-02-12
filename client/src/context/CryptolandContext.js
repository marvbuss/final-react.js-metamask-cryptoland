import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getTransactions, transfer } from "../services/ethService";

export const CryptolandsContext = React.createContext();

const { ethereum } = window;

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
        if (typeof ethereum == "undefined") return;
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
            if (typeof ethereum == "undefined") return;
            const structuredTransfers = await getTransactions();
            setTransfers(structuredTransfers);
        } catch (err) {
            console.log(err);
        }
    };

    const connectWalletHandler = () => {
        if (typeof ethereum == "undefined") return;
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
        if (typeof ethereum == "undefined") return;
        transfer(walletAddress, formData, (isLoading) => {
            setIsLoading(isLoading);

            if (!isLoading) {
                window.location.reload();
            }
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
