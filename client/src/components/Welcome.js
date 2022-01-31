import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { Loader } from "./Loader";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

function Welcome() {
    const [error, setError] = useState(false);
    const errorMessage = "Something went wrong. Please try again!";

    const [walletAddress, setWalletAddress] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [connectWalletBtnTxt, setConnectWalletBtnTxt] =
        useState("Connect Wallet");

    const connectWalletHandler = () => {
        if (typeof window.ethereum !== "undefined") {
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((result) => {
                    //result gives back an array of accounts
                    walletChangedHandler(result[0]);
                });
        } else {
            setError(true);
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
            });
    };

    const chainChangedHandler = () => {
        window.location.reload();
    };

    window.ethereum.on("accountsChanged", walletChangedHandler);
    window.ethereum.on("chainChanged", chainChangedHandler);

    return (
        <>
            <div className="welcome-wrapper">
                <div className="welcome-container-1">
                    <h1>
                        Send Crypto
                        <br />
                        across
                        <br />
                        the world
                    </h1>
                    <p>
                        Explore the crypto world. Buy and sell <br />
                        cryptocurrencies.
                    </p>
                    <button
                        type="button"
                        className="connect-wallet-btn"
                        onClick={connectWalletHandler}
                    >
                        {connectWalletBtnTxt}
                    </button>
                </div>
                <div className="welcome-container-2">
                    <div className="eth-card">
                        <SiEthereum className="eth-eth" />
                        <BsInfoCircle className="eth-info" />
                        <div className="wallet-address">{walletAddress}</div>
                        <div className="wallet-balance">{walletBalance}</div>
                    </div>
                    <div className="transaction-container">
                        <form className="transaction-form">
                            <input
                                name="address"
                                placeholder="Address to"
                                type="text"
                            />
                            <input
                                name="amount"
                                placeholder="Amount (ETH)"
                                step="0.0001"
                                type="number"
                            />
                            <input
                                name="message"
                                placeholder="Enter Message"
                                type="text"
                            />
                            <button>Send Now</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Welcome;
