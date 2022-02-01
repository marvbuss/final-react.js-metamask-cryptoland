import React, { useContext } from "react";
import { CryptolandsContext } from "../../context/CryptolandContext";
import Cryptoland from "../Cryptoland/Cryptoland";

const TransactionCard = ({
    addressFrom,
    addressTo,
    payment_reference,
    amount,
    timestamp,
}) => {
    return (
        <div className="transaction-card">
            <div className="transaction">
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
                <p>Amount: {amount}</p>
                <p>Reference: {payment_reference}</p>
                <p>{timestamp}</p>
                <Cryptoland />
            </div>
        </div>
    );
};

function Transfers() {
    const { walletAddress } = useContext(CryptolandsContext);
    const { transactions } = useContext(CryptolandsContext);
    return (
        <>
            <div className="transactions-container">
                {walletAddress ? (
                    <h1>Latest Transfers</h1>
                ) : (
                    <h1>Connect your Wallet to see the Latest Transfers</h1>
                )}
                <div className="transactions-wrapper">
                    {transactions.reverse().map((transaction, i) => {
                        return <TransactionCard key={i} {...transaction} />;
                    })}
                </div>
            </div>
        </>
    );
}

export default Transfers;
