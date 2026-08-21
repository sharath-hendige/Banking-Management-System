import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:9090/api";

function Transfer() {

    const [accounts, setAccounts] = useState([]);
    const [senderAccountNumber, setSenderAccountNumber] = useState("");
    const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
                setSenderAccountNumber(
                    data[0].accountNumber
                );
            }

        } catch (err) {

            setError(err.message);

        }
    };

    const handleTransfer = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!senderAccountNumber) {
            setError("Please select sender account.");
            return;
        }

        if (!receiverAccountNumber.trim()) {
            setError("Enter receiver account number.");
            return;
        }

        if (
            senderAccountNumber ===
            receiverAccountNumber.trim()
        ) {
            setError(
                "Sender and receiver accounts cannot be the same."
            );
            return;
        }

        if (!amount || Number(amount) <= 0) {
            setError("Enter a valid amount.");
            return;
        }

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/transactions/transfer`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        senderAccountNumber,
                        receiverAccountNumber:
                            receiverAccountNumber.trim(),
                        amount: Number(amount)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Transfer failed"
                );
            }

            setMessage(
                `₹${amount} transferred successfully.`
            );

            setAmount("");
            setReceiverAccountNumber("");

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="transaction-page">

            <h2>Transfer Money</h2>

            <form onSubmit={handleTransfer}>

                <label>Sender Account</label>

                <select
                    value={senderAccountNumber}
                    onChange={(e) =>
                        setSenderAccountNumber(e.target.value)
                    }
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
                            {" - ₹"}
                            {account.balance}
                        </option>
                    ))}

                </select>

                <label>Receiver Account Number</label>

                <input
                    type="text"
                    value={receiverAccountNumber}
                    onChange={(e) =>
                        setReceiverAccountNumber(e.target.value)
                    }
                    placeholder="Enter receiver account number"
                />

                <label>Amount</label>

                <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) =>
                        setAmount(e.target.value)
                    }
                    placeholder="Enter amount"
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Processing..."
                        : "Transfer"}
                </button>

            </form>

            {message && (
                <p className="success-message">
                    {message}
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

        </div>
    );
}

export default Transfer;