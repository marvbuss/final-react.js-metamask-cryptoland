import React, { useContext } from "react";
import { CryptolandsContext } from "../../context/CryptolandContext";
import Cryptoland from "../Cryptoland/Cryptoland";

const TransferCard = ({
    addressFrom,
    addressTo,
    payment_reference,
    amount,
    timestamp,
}) => {
    return (
        <div className="payment-card">
            <div className="payment-input">
                <a
                    href={`https://ropsten.etherscan.io/address/${addressFrom}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <p>From: {addressFrom}</p>
                </a>
                <a
                    href={`https://ropsten.etherscan.io/address/${addressTo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <p>To: {addressTo}</p>
                </a>
                <p>Amount: {amount} (ETH)</p>
                <p>Reference: {payment_reference}</p>
                <p>{timestamp}</p>
                <Cryptoland />
            </div>
        </div>
    );
};

function Transfers() {
    const { walletAddress } = useContext(CryptolandsContext);
    const { transfers } = useContext(CryptolandsContext);

    return (
        <>
            <div className="transfer-container">
                {walletAddress ? (
                    <h1>Latest Transfers</h1>
                ) : (
                    <h1>Connect your Wallet to see the Latest Transfers</h1>
                )}
                <div className="transfer-wrapper">
                    {transfers.map((transfer, i) => {
                        return <TransferCard key={i} {...transfer} />;
                    })}
                </div>
            </div>
        </>
    );
}

export default Transfers;
