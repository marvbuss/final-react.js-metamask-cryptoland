import React, { useContext } from "react";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { CryptolandsContext } from "../../context/CryptolandContext";

function Welcome() {
    const {
        walletAddress,
        walletBalance,
        formData,
        isLoading,
        handleChange,
        connectWalletHandler,
        initiateTransferHandler,
    } = useContext(CryptolandsContext);

    const handleSubmit = (e) => {
        const { address, amount, payment_reference } = formData;
        e.preventDefault();
        initiateTransferHandler();

        if (!address || !amount || !payment_reference) return;
    };

    return (
        <>
            <div className="welcome-container">
                <div className="welcome-container-1">
                    <div className="welcome-info">
                        <h1>
                            Transfer Crypto <br /> across the world
                        </h1>
                        <p>
                            Discover the Crypto World and join the movement.
                            <br />
                            Make your payments with cryptocurrency via Crypto
                            Land.
                        </p>
                        {!walletAddress && (
                            <button
                                type="button"
                                className="connect-wallet-btn"
                                onClick={connectWalletHandler}
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
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
                                placeholder="Enter Payment Reference"
                                type="text"
                                onChange={({ target }) =>
                                    handleChange({ target })
                                }
                            />
                            {!isLoading ? (
                                <button onClick={handleSubmit}>
                                    Transfer Now
                                </button>
                            ) : (
                                <button>Loading...</button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Welcome;
