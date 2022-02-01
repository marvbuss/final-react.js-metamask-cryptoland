import React, { useContext } from "react";
import { TransactionsContext } from "../context/TransactionContext";

import Cryptoland from "./Cryptoland";

const TransactionCard = ({
    addressFrom,
    addressTo,
    timestamp,
    message,
    amount,
    url,
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
                <p>{timestamp}</p>
                <Cryptoland />
            </div>
        </div>
    );
};

function Transactions() {
    const { walletAddress } = useContext(TransactionsContext);
    const { transactions } = useContext(TransactionsContext);
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

export default Transactions;
