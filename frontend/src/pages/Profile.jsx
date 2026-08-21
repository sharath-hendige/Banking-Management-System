import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:9090";

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Load user information from localStorage
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                } catch (error) {
                    console.error("Unable to parse stored user:", error);
                }
            }

            // Load user's accounts
            const response = await fetch(
                `${API_BASE_URL}/api/accounts/my`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load account information.");
            }

            const accountData = await response.json();

            setAccounts(accountData);

        } catch (err) {
            console.error("Profile error:", err);

            setError(
                err.message ||
                "Unable to load profile information."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <h2>Loading Profile...</h2>
            </div>
        );
    }

    return (
        <div style={styles.page}>

            {/* HEADER */}

            <header style={styles.header}>

                <div>
                    <h2 style={styles.title}>
                        Banking Management System
                    </h2>

                    <p style={styles.subtitle}>
                        My Profile
                    </p>
                </div>

                <div style={styles.headerButtons}>

                    <button
                        onClick={() => navigate("/dashboard")}
                        style={styles.dashboardButton}
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={handleLogout}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>

                </div>

            </header>

            {/* MAIN */}

            <main style={styles.container}>

                <h1 style={styles.heading}>
                    My Profile
                </h1>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                {/* PERSONAL INFORMATION */}

                <div style={styles.card}>

                    <h2 style={styles.cardTitle}>
                        Personal Information
                    </h2>

                    <div style={styles.profileGrid}>

                        <div style={styles.infoItem}>
                            <span style={styles.label}>
                                Name
                            </span>

                            <span style={styles.value}>
                                {user?.name || "-"}
                            </span>
                        </div>

                        <div style={styles.infoItem}>
                            <span style={styles.label}>
                                Email
                            </span>

                            <span style={styles.value}>
                                {user?.email || "-"}
                            </span>
                        </div>

                        <div style={styles.infoItem}>
                            <span style={styles.label}>
                                Mobile
                            </span>

                            <span style={styles.value}>
                                {user?.mobile || "-"}
                            </span>
                        </div>

                        <div style={styles.infoItem}>
                            <span style={styles.label}>
                                Role
                            </span>

                            <span
                                style={
                                    user?.role === "ADMIN"
                                        ? styles.adminRole
                                        : styles.userRole
                                }
                            >
                                {user?.role || "USER"}
                            </span>
                        </div>

                    </div>

                </div>

                {/* ACCOUNTS */}

                <div style={styles.card}>

                    <div style={styles.cardHeader}>

                        <h2 style={styles.cardTitle}>
                            My Accounts
                        </h2>

                        <button
                            onClick={loadProfile}
                            style={styles.refreshButton}
                        >
                            Refresh
                        </button>

                    </div>

                    {accounts.length === 0 ? (

                        <div style={styles.empty}>
                            No bank accounts found.
                        </div>

                    ) : (

                        <div style={styles.tableContainer}>

                            <table style={styles.table}>

                                <thead>

                                    <tr>

                                        <th style={styles.th}>
                                            ID
                                        </th>

                                        <th style={styles.th}>
                                            Account Number
                                        </th>

                                        <th style={styles.th}>
                                            Account Type
                                        </th>

                                        <th style={styles.th}>
                                            Balance
                                        </th>

                                        <th style={styles.th}>
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {accounts.map((account) => (

                                        <tr key={account.id}>

                                            <td style={styles.td}>
                                                {account.id}
                                            </td>

                                            <td style={styles.td}>
                                                {account.accountNumber}
                                            </td>

                                            <td style={styles.td}>
                                                {account.accountType}
                                            </td>

                                            <td style={styles.td}>
                                                ₹{" "}
                                                {Number(
                                                    account.balance || 0
                                                ).toLocaleString("en-IN", {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>

                                            <td style={styles.td}>

                                                <span
                                                    style={
                                                        account.status?.toUpperCase() ===
                                                        "ACTIVE"
                                                            ? styles.activeStatus
                                                            : styles.inactiveStatus
                                                    }
                                                >
                                                    {account.status}
                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

                {/* ACTION BUTTONS */}

                <div style={styles.actions}>

                    <button
                        onClick={() => navigate("/dashboard")}
                        style={styles.primaryButton}
                    >
                        Back to Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/transactions")}
                        style={styles.secondaryButton}
                    >
                        Transaction History
                    </button>

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

    headerButtons: {
        display: "flex",
        gap: "10px",
    },

    dashboardButton: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
    },

    logoutButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
    },

    container: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "30px",
    },

    heading: {
        color: "#1f2937",
        marginBottom: "25px",
    },

    card: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "10px",
        marginBottom: "25px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    },

    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },

    cardTitle: {
        margin: 0,
        color: "#1f2937",
    },

    profileGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginTop: "20px",
    },

    infoItem: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "7px",
    },

    label: {
        fontSize: "13px",
        color: "#6b7280",
        fontWeight: "bold",
    },

    value: {
        fontSize: "16px",
        color: "#111827",
    },

    userRole: {
        color: "#007bff",
        fontWeight: "bold",
    },

    adminRole: {
        color: "#dc3545",
        fontWeight: "bold",
    },

    refreshButton: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "9px 16px",
        borderRadius: "5px",
        cursor: "pointer",
    },

    tableContainer: {
        width: "100%",
        overflowX: "auto",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "700px",
    },

    th: {
        backgroundColor: "#1f2937",
        color: "white",
        padding: "12px",
        textAlign: "left",
    },

    td: {
        padding: "12px",
        borderBottom: "1px solid #ddd",
    },

    activeStatus: {
        color: "#198754",
        fontWeight: "bold",
    },

    inactiveStatus: {
        color: "#dc3545",
        fontWeight: "bold",
    },

    empty: {
        padding: "30px",
        textAlign: "center",
        color: "#666",
        backgroundColor: "#f8f9fa",
        borderRadius: "6px",
    },

    actions: {
        display: "flex",
        gap: "15px",
        flexWrap: "wrap",
    },

    primaryButton: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "11px 20px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
    },

    secondaryButton: {
        backgroundColor: "#6f42c1",
        color: "white",
        border: "none",
        padding: "11px 20px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
    },

    error: {
        backgroundColor: "#ffe6e6",
        color: "#b00020",
        padding: "12px",
        borderRadius: "5px",
        marginBottom: "20px",
    },

    loadingContainer: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
    },
};

export default Profile;