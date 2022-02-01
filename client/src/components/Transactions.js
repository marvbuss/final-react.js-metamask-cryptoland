import React, { useContext } from "react";
import { TransactionsContext } from "../context/TransactionContext";

import { dummyData } from "../utils/dummyData";
import Cryptoland from "./Cryptoland";

const TransactionCard = ({
    address,
    timestamp,
    message,
    keyword,
    amount,
    addressTo,
    url,
}) => {
    return (
        <div className="transaction-card">
            <div className="transaction">
                <a
                    href={`https://ropsten.etherscan.io/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <p>From: {address}</p>
                </a>
                <a
                    href={`https://ropsten.etherscan.io/address/${address}`}
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
    return (
        <>
            <div className="transactions-container">
                {walletAddress ? (
                    <h1>Latest Transactions</h1>
                ) : (
                    <h1>Connect your Wallet to see the Latest Transactions</h1>
                )}
                <div className="transactions-wrapper">
                    {dummyData.reverse().map((transaction, i) => {
                        return <TransactionCard key={i} {...transaction} />;
                    })}
                </div>
            </div>
        </>
    );
}

export default Transactions;
