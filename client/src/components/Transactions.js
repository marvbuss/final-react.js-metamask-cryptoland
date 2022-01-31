import React, { useContext } from "react";
import {
    TransactionContext,
    TransactionsContext,
} from "../context/TransactionContext";

import { dummyData } from "../utils/dummyData";

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
                <p>Message: {message}</p>
                <p>{timestamp}</p>
            </div>
        </div>
    );
};

function Transactions() {
    const { walletAddress } = useContext(TransactionsContext);
    return (
        <>
            <div className="transactions-container">
                <div className="transactions-wrapper">
                    {walletAddress ? (
                        <h1>Latest Transactions</h1>
                    ) : (
                        <h1>
                            Connect your account to see the Latest Transactions
                        </h1>
                    )}
                    <div className="transactions">
                        {dummyData.reverse().map((transaction, i) => {
                            return <TransactionCard key={i} {...transaction} />;
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Transactions;
