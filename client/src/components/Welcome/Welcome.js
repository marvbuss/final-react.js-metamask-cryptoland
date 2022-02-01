import React, { useContext } from "react";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { CryptolandsContext } from "../context/CryptolandContext";

function Welcome() {
    const {
        walletAddress,
        walletBalance,
        connectWalletBtnTxt,
        connectWalletHandler,
        formData,
        sendTransaction,
        handleChange,
    } = useContext(CryptolandsContext);

    const handleSubmit = (e) => {
        const { address, amount, payment_reference } = formData;
        e.preventDefault();
        sendTransaction();

        if (!address || !amount || !payment_reference) return;
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
                        with cryptocurrency via Crypto Land.
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
                                name="payment_reference"
                                placeholder="Enter Reference"
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
