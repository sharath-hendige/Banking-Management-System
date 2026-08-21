import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:9090";

const Withdraw = () => {

    const navigate = useNavigate();

    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleWithdraw = async (event) => {

        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        setError("");
        setSuccess("");

        if (!accountNumber.trim()) {
            setError("Please enter your account number.");
            return;
        }

        if (!amount || Number(amount) <= 0) {
            setError("Please enter a valid withdrawal amount.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/transactions/withdraw`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        accountNumber: accountNumber.trim(),
                        amount: Number(amount),
                    }),
                }
            );

            if (response.status === 401) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
                return;
            }

            if (response.status === 403) {
                throw new Error(
                    "You are not authorized to withdraw money."
                );
            }

            if (!response.ok) {

                const message = await response.text();

                throw new Error(
                    message || "Withdrawal failed."
                );
            }

            const data = await response.json();

            console.log(
                "WITHDRAW RESPONSE:",
                data
            );

            setSuccess(
                `Withdrawal successful. ₹${Number(amount).toLocaleString(
                    "en-IN"
                )} withdrawn from account ${accountNumber}.`
            );

            setAmount("");

        } catch (err) {

            console.error(
                "Withdraw error:",
                err
            );

            setError(
                err.message ||
                "Unable to process withdrawal."
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div style={styles.page}>

            {/* HEADER */}

            <header style={styles.header}>

                <div>

                    <h2 style={styles.title}>
                        Banking Management System
                    </h2>

                    <p style={styles.subtitle}>
                        Withdraw Money
                    </p>

                </div>

                <button
                    onClick={() => navigate("/dashboard")}
                    style={styles.backButton}
                >
                    Back to Dashboard
                </button>

            </header>


            {/* MAIN */}

            <main style={styles.container}>

                <div style={styles.card}>

                    <h1 style={styles.heading}>
                        Withdraw Money
                    </h1>

                    <p style={styles.description}>
                        Withdraw money from your bank account.
                    </p>


                    {/* ERROR */}

                    {error && (

                        <div style={styles.error}>
                            {error}
                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div style={styles.success}>
                            {success}
                        </div>

                    )}


                    <form onSubmit={handleWithdraw}>

                        {/* ACCOUNT NUMBER */}

                        <div style={styles.formGroup}>

                            <label style={styles.label}>
                                Account Number
                            </label>

                            <input
                                type="text"
                                placeholder="Enter account number"
                                value={accountNumber}
                                onChange={(e) =>
                                    setAccountNumber(
                                        e.target.value
                                    )
                                }
                                style={styles.input}
                            />

                        </div>


                        {/* AMOUNT */}

                        <div style={styles.formGroup}>

                            <label style={styles.label}>
                                Withdrawal Amount
                            </label>

                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(
                                        e.target.value
                                    )
                                }
                                style={styles.input}
                            />

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.withdrawButton,
                                opacity: loading ? 0.7 : 1,
                            }}
                        >

                            {loading
                                ? "Processing..."
                                : "Withdraw Money"}

                        </button>

                    </form>

                </div>


                {/* INFORMATION */}

                <div style={styles.infoCard}>

                    <h2>
                        Withdrawal Information
                    </h2>

                    <ul style={styles.list}>

                        <li>
                            Enter a valid account number.
                        </li>

                        <li>
                            Withdrawal amount must be greater
                            than zero.
                        </li>

                        <li>
                            You cannot withdraw more than
                            your available balance.
                        </li>

                        <li>
                            A withdrawal transaction will be
                            recorded automatically.
                        </li>

                    </ul>

                </div>

            </main>

        </div>
    );
};


const styles = {

    page: {
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
    },

    header: {
        minHeight: "75px",
        backgroundColor: "#111827",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        boxSizing: "border-box",
    },

    title: {
        margin: 0,
        fontSize: "22px",
    },

    subtitle: {
        margin: "5px 0 0",
        color: "#cbd5e1",
        fontSize: "14px",
    },

    backButton: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
    },

    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 30px",
    },

    card: {
        backgroundColor: "white",
        padding: "35px",
        borderRadius: "10px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    },

    heading: {
        marginTop: 0,
        color: "#1f2937",
    },

    description: {
        color: "#666",
        marginBottom: "30px",
    },

    formGroup: {
        marginBottom: "22px",
    },

    label: {
        display: "block",
        fontWeight: "bold",
        marginBottom: "8px",
        color: "#333",
    },

    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "15px",
        boxSizing: "border-box",
    },

    withdrawButton: {
        width: "100%",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "13px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
    },

    error: {
        backgroundColor: "#ffe6e6",
        color: "#b00020",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "20px",
    },

    success: {
        backgroundColor: "#e6f7ed",
        color: "#198754",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "20px",
        fontWeight: "bold",
    },

    infoCard: {
        backgroundColor: "white",
        marginTop: "25px",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    },

    list: {
        lineHeight: "1.8",
        color: "#555",
    },
};

export default Withdraw;