import React, { useContext } from "react";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

import { TransactionsContext } from "../context/TransactionContext";

function Welcome() {
    const {
        walletAddress,
        walletBalance,
        connectWalletBtnTxt,
        connectWalletHandler,
        formData,
        sendTransaction,
        handleChange,
    } = useContext(TransactionsContext);

    const handleSubmit = (e) => {
        const { address, amount, keyword, message } = formData;
        e.preventDefault();
        sendTransaction();

        if (!address || !amount || !keyword || !message) return;
    };

    return (
        <>
            <div className="welcome-wrapper">
                <div className="welcome-container-1">
                    <h1>
                        Transfer Crypto
                        <br />
                        across
                        <br />
                        the world
                    </h1>
                    <p>
                        Discover the crypto world. Make your payments <br />
                        with cryptocurrencies via Crypto Land.
                    </p>
                    {!walletAddress && (
                        <button
                            type="button"
                            className="connect-wallet-btn"
                            onClick={connectWalletHandler}
                        >
                            {connectWalletBtnTxt}
                        </button>
                    )}
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
                                onChange={({ target }) =>
                                    handleChange({ target })
                                }
                            />
                            <input
                                name="amount"
                                placeholder="Amount (ETH)"
                                step="0.0001"
                                type="number"
                                onChange={({ target }) =>
                                    handleChange({ target })
                                }
                            />
                            <input
                                name="keyword"
                                placeholder="Enter Keyword"
                                type="text"
                                onChange={({ target }) =>
                                    handleChange({ target })
                                }
                            />
                            <input
                                name="message"
                                placeholder="Enter Message"
                                type="text"
                                onChange={({ target }) =>
                                    handleChange({ target })
                                }
                            />
                            <button onClick={handleSubmit}>Send Now</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Welcome;
