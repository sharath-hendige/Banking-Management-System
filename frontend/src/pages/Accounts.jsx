import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:9090";

const Accounts = () => {

    const navigate = useNavigate();

    const [accountType, setAccountType] = useState("SAVINGS");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const createAccount = async (event) => {

        event.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            setLoading(true);
            setError("");
            setSuccess("");

            const response = await fetch(
                `${API_BASE_URL}/api/accounts`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        accountType: accountType,
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
                    "You are not authorized to create an account."
                );
            }

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(
                    message ||
                    "Failed to create account."
                );
            }

            const data = await response.json();

            console.log(
                "ACCOUNT CREATED:",
                data
            );

            setSuccess(
                `Account created successfully. Account Number: ${data.accountNumber}`
            );

            setAccountType("SAVINGS");

        } catch (err) {

            console.error(
                "Create account error:",
                err
            );

            setError(
                err.message ||
                "Unable to create account."
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
                        Create Bank Account
                    </p>

                </div>

                <button
                    onClick={() => navigate("/dashboard")}
                    style={styles.dashboardButton}
                >
                    Back to Dashboard
                </button>

            </header>


            {/* MAIN */}

            <main style={styles.container}>

                <div style={styles.card}>

                    <h1 style={styles.heading}>
                        Create New Account
                    </h1>

                    <p style={styles.description}>
                        Select the type of bank account you want to create.
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


                    {/* FORM */}

                    <form onSubmit={createAccount}>

                        <div style={styles.formGroup}>

                            <label style={styles.label}>
                                Account Type
                            </label>

                            <select
                                value={accountType}
                                onChange={(e) =>
                                    setAccountType(
                                        e.target.value
                                    )
                                }
                                style={styles.select}
                            >

                                <option value="SAVINGS">
                                    Savings Account
                                </option>

                                <option value="CURRENT">
                                    Current Account
                                </option>

                            </select>

                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.createButton,
                                opacity: loading ? 0.7 : 1,
                            }}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account"}

                        </button>

                    </form>

                </div>


                {/* INFORMATION */}

                <div style={styles.infoCard}>

                    <h2>
                        Account Information
                    </h2>

                    <ul style={styles.list}>

                        <li>
                            Savings accounts are suitable
                            for regular personal banking.
                        </li>

                        <li>
                            Current accounts are generally
                            used for frequent transactions.
                        </li>

                        <li>
                            Your account number will be
                            generated automatically.
                        </li>

                        <li>
                            The initial balance will be
                            determined by the backend system.
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

    dashboardButton: {
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
        marginBottom: "25px",
    },

    label: {
        display: "block",
        fontWeight: "bold",
        marginBottom: "8px",
        color: "#333",
    },

    select: {
        width: "100%",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "15px",
        boxSizing: "border-box",
        backgroundColor: "white",
    },

    createButton: {
        width: "100%",
        backgroundColor: "#198754",
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

export default Accounts;