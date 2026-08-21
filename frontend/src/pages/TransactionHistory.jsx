import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:9090/api";

function TransactionHistory() {

    const [accounts, setAccounts] = useState([]);
    const [accountNumber, setAccountNumber] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/accounts/my`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load accounts");
            }

            const data = await response.json();

            setAccounts(data);

            if (data.length > 0) {

                setAccountNumber(
                    data[0].accountNumber
                );

                fetchTransactions(
                    data[0].accountNumber
                );
            }

        } catch (err) {

            setError(err.message);

        }
    };

    const fetchTransactions = async (number) => {

        if (!number) return;

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/transactions/history/${number}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load transaction history"
                );
            }

            const data = await response.json();

            setTransactions(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);
        }
    };

    const handleAccountChange = (e) => {

        const number = e.target.value;

        setAccountNumber(number);

        fetchTransactions(number);
    };

    return (
        <div className="transaction-history">

            <h2>Transaction History</h2>

            <label>Select Account</label>

            <select
                value={accountNumber}
                onChange={handleAccountChange}
            >

                <option value="">
                    Select Account
                </option>

                {accounts.map((account) => (
                    <option
                        key={account.id}
                        value={account.accountNumber}
                    >
                        {account.accountNumber}
                    </option>
                ))}

            </select>

            {loading && (
                <p>Loading transactions...</p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!loading &&
                !error &&
                transactions.length === 0 && (
                    <p>
                        No transactions found.
                    </p>
                )}

            {transactions.length > 0 && (

                <table>

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Description</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {transactions.map((transaction) => (

                            <tr key={transaction.id}>

                                <td>
                                    {transaction.id}
                                </td>

                                <td>
                                    {transaction.type}
                                </td>

                                <td>
                                    ₹{transaction.amount}
                                </td>

                                <td>
                                    {transaction.senderAccount || "-"}
                                </td>

                                <td>
                                    {transaction.receiverAccount || "-"}
                                </td>

                                <td>
                                    {transaction.description || "-"}
                                </td>

                                <td>
                                    {transaction.transactionDate
                                        ? new Date(
                                            transaction.transactionDate
                                        ).toLocaleString()
                                        : "-"
                                    }
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>
    );
}

export default TransactionHistory;