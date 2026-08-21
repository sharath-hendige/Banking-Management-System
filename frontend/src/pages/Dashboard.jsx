import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:9090";

const Dashboard = () => {
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [transactionLoading, setTransactionLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const [showDeposit, setShowDeposit] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [showTransactions, setShowTransactions] = useState(false);

    const [selectedAccount, setSelectedAccount] = useState("");

    const [accountType, setAccountType] = useState("SAVINGS");

    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");

    const [receiverAccount, setReceiverAccount] = useState("");
    const [transferAmount, setTransferAmount] = useState("");

    useEffect(() => {
        fetchAccounts();
    }, []);

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const getUser = () => {
        try {
            return JSON.parse(localStorage.getItem("user")) || {};
        } catch {
            return {};
        }
    };

    const getHeaders = () => {
        const token = getToken();

        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
    };

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    const logoutAndRedirect = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const getErrorMessage = (data, fallback) => {
        if (data?.message) {
            return data.message;
        }

        if (data?.error) {
            return data.error;
        }

        if (typeof data === "string" && data.trim()) {
            return data;
        }

        return fallback;
    };

    const fetchAccounts = async () => {
        const token = getToken();

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/api/accounts/my`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            if (response.status === 401 || response.status === 403) {
                logoutAndRedirect();
                return;
            }

            if (!response.ok) {
                throw new Error("Unable to load your accounts.");
            }

            const data = await response.json();

            setAccounts(data);

            if (data.length > 0) {
                const accountExists = data.some(
                    (account) =>
                        account.accountNumber === selectedAccount
                );

                if (!selectedAccount || !accountExists) {
                    setSelectedAccount(data[0].accountNumber);
                }
            } else {
                setSelectedAccount("");
            }

        } catch (err) {
            console.error(err);
            setError(
                err.message || "Unable to load account information."
            );
        } finally {
            setLoading(false);
        }
    };

    // CREATE ACCOUNT
    const handleCreateAccount = async (e) => {
        e.preventDefault();

        clearMessages();

        try {
            setTransactionLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/accounts`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        accountType: accountType,
                    }),
                }
            );

            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                logoutAndRedirect();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        "Unable to create the account."
                    )
                );
            }

            setSuccess(
                `Account created successfully. Account Number: ${data.accountNumber}`
            );

            setAccountType("SAVINGS");
            setShowCreateAccount(false);

            await fetchAccounts();

        } catch (err) {
            console.error(err);
            setError(
                err.message || "Unable to create account."
            );
        } finally {
            setTransactionLoading(false);
        }
    };

    // DEPOSIT
    const handleDeposit = async (e) => {
        e.preventDefault();

        clearMessages();

        if (!selectedAccount) {
            setError("Please select an account.");
            return;
        }

        if (!depositAmount || Number(depositAmount) <= 0) {
            setError("Please enter a valid deposit amount.");
            return;
        }

        try {
            setTransactionLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/transactions/deposit`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        accountNumber: selectedAccount,
                        amount: Number(depositAmount),
                    }),
                }
            );

            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                logoutAndRedirect();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(data, "Deposit failed.")
                );
            }

            setSuccess(
                `₹${depositAmount} deposited successfully.`
            );

            setDepositAmount("");
            setShowDeposit(false);

            await fetchAccounts();

        } catch (err) {
            console.error(err);
            setError(err.message || "Deposit failed.");
        } finally {
            setTransactionLoading(false);
        }
    };

    // WITHDRAW
    const handleWithdraw = async (e) => {
        e.preventDefault();

        clearMessages();

        if (!selectedAccount) {
            setError("Please select an account.");
            return;
        }

        if (!withdrawAmount || Number(withdrawAmount) <= 0) {
            setError("Please enter a valid withdrawal amount.");
            return;
        }

        try {
            setTransactionLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/transactions/withdraw`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        accountNumber: selectedAccount,
                        amount: Number(withdrawAmount),
                    }),
                }
            );

            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                logoutAndRedirect();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(
                        data,
                        "Withdrawal failed."
                    )
                );
            }

            setSuccess(
                `₹${withdrawAmount} withdrawn successfully.`
            );

            setWithdrawAmount("");
            setShowWithdraw(false);

            await fetchAccounts();

        } catch (err) {
            console.error(err);
            setError(err.message || "Withdrawal failed.");
        } finally {
            setTransactionLoading(false);
        }
    };

    // TRANSFER
    const handleTransfer = async (e) => {
        e.preventDefault();

        clearMessages();

        if (!selectedAccount) {
            setError("Please select your account.");
            return;
        }

        if (!receiverAccount) {
            setError("Please enter receiver account number.");
            return;
        }

        if (selectedAccount === receiverAccount) {
            setError(
                "Sender and receiver accounts cannot be the same."
            );
            return;
        }

        if (!transferAmount || Number(transferAmount) <= 0) {
            setError("Please enter a valid transfer amount.");
            return;
        }

        try {
            setTransactionLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/transactions/transfer`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        senderAccountNumber: selectedAccount,
                        receiverAccountNumber: receiverAccount,
                        amount: Number(transferAmount),
                    }),
                }
            );

            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                logoutAndRedirect();
                return;
            }

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(data, "Transfer failed.")
                );
            }

            setSuccess(
                `₹${transferAmount} transferred successfully.`
            );

            setReceiverAccount("");
            setTransferAmount("");
            setShowTransfer(false);

            await fetchAccounts();

        } catch (err) {
            console.error(err);
            setError(err.message || "Transfer failed.");
        } finally {
            setTransactionLoading(false);
        }
    };

    // TRANSACTION HISTORY
    const fetchTransactions = async (accountNumber) => {
        clearMessages();

        try {
            setTransactionLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/transactions/history/${accountNumber}`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            if (response.status === 401 || response.status === 403) {
                logoutAndRedirect();
                return;
            }

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));

                throw new Error(
                    getErrorMessage(
                        data,
                        "Unable to load transaction history."
                    )
                );
            }

            const data = await response.json();

            setTransactions(data);
            setShowTransactions(true);

        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Unable to load transaction history."
            );
        } finally {
            setTransactionLoading(false);
        }
    };

    // LOGOUT
    const handleLogout = () => {
        logoutAndRedirect();
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString();
    };

    const formatCurrency = (amount) => {
        return Number(amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const totalBalance = accounts.reduce(
        (total, account) =>
            total + Number(account.balance || 0),
        0
    );

    const user = getUser();

    const userName =
        user?.name ||
        user?.username ||
        user?.email?.split("@")[0] ||
        "User";

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingCard}>
                    <div style={styles.spinner}></div>
                    <h2 style={styles.loadingTitle}>
                        Loading Dashboard
                    </h2>
                    <p style={styles.loadingText}>
                        Please wait while we load your banking information.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <header style={styles.header}>

                <div style={styles.brandSection}>
                    <div style={styles.logo}>
                        B
                    </div>

                    <div>
                        <h2 style={styles.title}>
                            Banking Management System
                        </h2>

                        <p style={styles.subtitle}>
                            Secure Digital Banking
                        </p>
                    </div>
                </div>

                <div style={styles.headerRight}>

                    <div style={styles.userInfo}>
                        <div style={styles.userAvatar}>
                            {userName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <strong style={styles.headerUserName}>
                                {userName}
                            </strong>

                            <span style={styles.userRole}>
                                USER
                            </span>
                        </div>
                    </div>

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

                {/* WELCOME */}
                <div style={styles.welcomeSection}>

                    <div>
                        <p style={styles.welcomeLabel}>
                            PERSONAL BANKING
                        </p>

                        <h1 style={styles.welcome}>
                            Welcome, {userName} 👋
                        </h1>

                        <p style={styles.welcomeText}>
                            Manage your accounts and banking activities
                            from one secure dashboard.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/profile")}
                        style={styles.profileButton}
                    >
                        My Profile
                    </button>

                </div>

                {/* MESSAGES */}
                {success && (
                    <div style={styles.success}>
                        <span style={styles.messageIcon}>✓</span>
                        <span>{success}</span>
                    </div>
                )}

                {error && (
                    <div style={styles.error}>
                        <span style={styles.messageIcon}>!</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* SUMMARY CARDS */}
                <section style={styles.summaryGrid}>

                    <div style={styles.summaryCard}>

                        <div
                            style={{
                                ...styles.summaryIcon,
                                backgroundColor: "#e8f1ff",
                                color: "#1769e0",
                            }}
                        >
                            🏦
                        </div>

                        <div>
                            <p style={styles.summaryLabel}>
                                TOTAL ACCOUNTS
                            </p>

                            <h2 style={styles.summaryValue}>
                                {accounts.length}
                            </h2>

                            <p style={styles.summaryDescription}>
                                Active banking accounts
                            </p>
                        </div>

                    </div>

                    <div style={styles.summaryCard}>

                        <div
                            style={{
                                ...styles.summaryIcon,
                                backgroundColor: "#e9f8ef",
                                color: "#198754",
                            }}
                        >
                            ₹
                        </div>

                        <div>
                            <p style={styles.summaryLabel}>
                                TOTAL BALANCE
                            </p>

                            <h2 style={styles.balanceSummary}>
                                ₹{formatCurrency(totalBalance)}
                            </h2>

                            <p style={styles.summaryDescription}>
                                Across all your accounts
                            </p>
                        </div>

                    </div>

                    <div style={styles.summaryCard}>

                        <div
                            style={{
                                ...styles.summaryIcon,
                                backgroundColor: "#f1eaff",
                                color: "#6f42c1",
                            }}
                        >
                            🔐
                        </div>

                        <div>
                            <p style={styles.summaryLabel}>
                                ACCOUNT STATUS
                            </p>

                            <h2 style={styles.statusSummary}>
                                {accounts.length > 0
                                    ? "Active"
                                    : "No Account"}
                            </h2>

                            <p style={styles.summaryDescription}>
                                Banking access status
                            </p>
                        </div>

                    </div>

                </section>

                {/* ACCOUNTS SECTION */}
                <section style={styles.section}>

                    <div style={styles.sectionHeader}>

                        <div>
                            <p style={styles.sectionLabel}>
                                BANKING
                            </p>

                            <h2 style={styles.sectionHeading}>
                                My Accounts
                            </h2>
                        </div>

                        <button
                            onClick={() => setShowCreateAccount(true)}
                            style={styles.createAccountButton}
                        >
                            + Create Account
                        </button>

                    </div>

                    {accounts.length === 0 ? (
                        <div style={styles.noAccount}>

                            <div style={styles.emptyIcon}>
                                🏦
                            </div>

                            <h2 style={styles.emptyTitle}>
                                No accounts found
                            </h2>

                            <p style={styles.emptyText}>
                                You don't have a bank account yet.
                                Create your first account to get started.
                            </p>

                            <button
                                onClick={() =>
                                    setShowCreateAccount(true)
                                }
                                style={styles.emptyButton}
                            >
                                Create Your First Account
                            </button>

                        </div>
                    ) : (
                        <div style={styles.accountGrid}>

                            {accounts.map((account) => {

                                const isActive =
                                    String(account.status).toUpperCase() ===
                                    "ACTIVE";

                                return (
                                    <div
                                        key={account.id}
                                        style={styles.accountCard}
                                    >

                                        <div style={styles.accountTop}>

                                            <div>
                                                <p style={styles.accountTypeLabel}>
                                                    {account.accountType}
                                                </p>

                                                <h3 style={styles.cardTitle}>
                                                    {account.accountType ===
                                                    "SAVINGS"
                                                        ? "Savings Account"
                                                        : "Current Account"}
                                                </h3>
                                            </div>

                                            <span
                                                style={{
                                                    ...styles.statusBadge,
                                                    backgroundColor: isActive
                                                        ? "#e8f7ee"
                                                        : "#fdecec",
                                                    color: isActive
                                                        ? "#198754"
                                                        : "#dc3545",
                                                }}
                                            >
                                                ●{" "}
                                                {account.status ||
                                                    "UNKNOWN"}
                                            </span>

                                        </div>

                                        <div style={styles.accountNumberBox}>

                                            <span style={styles.smallLabel}>
                                                ACCOUNT NUMBER
                                            </span>

                                            <strong style={styles.accountNumber}>
                                                {account.accountNumber}
                                            </strong>

                                        </div>

                                        <div style={styles.balanceBox}>

                                            <span style={styles.smallLabel}>
                                                AVAILABLE BALANCE
                                            </span>

                                            <h2 style={styles.balance}>
                                                ₹
                                                {formatCurrency(
                                                    account.balance
                                                )}
                                            </h2>

                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedAccount(
                                                    account.accountNumber
                                                );
                                            }}
                                            style={{
                                                ...styles.selectAccountButton,
                                                backgroundColor:
                                                    selectedAccount ===
                                                    account.accountNumber
                                                        ? "#1769e0"
                                                        : "#eef4ff",
                                                color:
                                                    selectedAccount ===
                                                    account.accountNumber
                                                        ? "white"
                                                        : "#1769e0",
                                            }}
                                        >
                                            {selectedAccount ===
                                            account.accountNumber
                                                ? "✓ Selected Account"
                                                : "Select Account"}
                                        </button>

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </section>

                {/* SELECT ACCOUNT */}
                {accounts.length > 0 && (
                    <section style={styles.selectorBox}>

                        <div>
                            <p style={styles.sectionLabel}>
                                ACCOUNT OPERATIONS
                            </p>

                            <h2 style={styles.selectorTitle}>
                                Select Account
                            </h2>

                            <p style={styles.selectorDescription}>
                                Choose the account you want to use for
                                your banking transaction.
                            </p>
                        </div>

                        <select
                            value={selectedAccount}
                            onChange={(e) =>
                                setSelectedAccount(e.target.value)
                            }
                            style={styles.select}
                        >
                            {accounts.map((account) => (
                                <option
                                    key={account.id}
                                    value={account.accountNumber}
                                >
                                    {account.accountNumber}
                                    {" - "}
                                    {account.accountType}
                                </option>
                            ))}
                        </select>

                    </section>
                )}

                {/* BANKING OPERATIONS */}
                {accounts.length > 0 && (
                    <section style={styles.section}>

                        <div style={styles.sectionHeader}>

                            <div>
                                <p style={styles.sectionLabel}>
                                    QUICK ACTIONS
                                </p>

                                <h2 style={styles.sectionHeading}>
                                    Banking Operations
                                </h2>
                            </div>

                        </div>

                        <div style={styles.actions}>

                            <button
                                style={{
                                    ...styles.actionButton,
                                    backgroundColor: "#198754",
                                }}
                                onClick={() => {
                                    clearMessages();
                                    setShowDeposit(true);
                                }}
                            >
                                <span style={styles.actionIcon}>
                                    ↓
                                </span>

                                <span>
                                    <strong>Deposit</strong>
                                    <small>
                                        Add money to account
                                    </small>
                                </span>
                            </button>

                            <button
                                style={{
                                    ...styles.actionButton,
                                    backgroundColor: "#dc3545",
                                }}
                                onClick={() => {
                                    clearMessages();
                                    setShowWithdraw(true);
                                }}
                            >
                                <span style={styles.actionIcon}>
                                    ↑
                                </span>

                                <span>
                                    <strong>Withdraw</strong>
                                    <small>
                                        Withdraw available funds
                                    </small>
                                </span>
                            </button>

                            <button
                                style={{
                                    ...styles.actionButton,
                                    backgroundColor: "#1769e0",
                                }}
                                onClick={() => {
                                    clearMessages();
                                    setShowTransfer(true);
                                }}
                            >
                                <span style={styles.actionIcon}>
                                    ⇄
                                </span>

                                <span>
                                    <strong>Transfer Money</strong>
                                    <small>
                                        Send money securely
                                    </small>
                                </span>
                            </button>

                            <button
                                style={{
                                    ...styles.actionButton,
                                    backgroundColor: "#6f42c1",
                                }}
                                onClick={() => {
                                    if (selectedAccount) {
                                        fetchTransactions(
                                            selectedAccount
                                        );
                                    } else {
                                        setError(
                                            "Please select an account."
                                        );
                                    }
                                }}
                            >
                                <span style={styles.actionIcon}>
                                    ≡
                                </span>

                                <span>
                                    <strong>Transactions</strong>
                                    <small>
                                        View transaction history
                                    </small>
                                </span>
                            </button>

                        </div>

                    </section>
                )}

                {/* SECURITY INFO */}
                <section style={styles.securityCard}>

                    <div style={styles.securityIcon}>
                        🔒
                    </div>

                    <div>
                        <h3 style={styles.securityTitle}>
                            Your banking is secure
                        </h3>

                        <p style={styles.securityText}>
                            Your account is protected with secure
                            authentication. Never share your password
                            or authentication token with anyone.
                        </p>
                    </div>

                </section>

            </main>

            {/* CREATE ACCOUNT MODAL */}
            {showCreateAccount && (
                <div style={styles.modalOverlay}>

                    <div style={styles.modal}>

                        <div style={styles.modalHeader}>
                            <div>
                                <p style={styles.sectionLabel}>
                                    NEW ACCOUNT
                                </p>

                                <h2 style={styles.modalTitle}>
                                    Create New Account
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    setShowCreateAccount(false)
                                }
                                style={styles.closeButton}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateAccount}>

                            <label style={styles.label}>
                                Account Type
                            </label>

                            <select
                                value={accountType}
                                onChange={(e) =>
                                    setAccountType(e.target.value)
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

                            <div style={styles.modalButtons}>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCreateAccount(false)
                                    }
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={transactionLoading}
                                    style={styles.confirmButton}
                                >
                                    {transactionLoading
                                        ? "Creating..."
                                        : "Create Account"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* DEPOSIT MODAL */}
            {showDeposit && (
                <div style={styles.modalOverlay}>

                    <div style={styles.modal}>

                        <div style={styles.modalHeader}>
                            <div>
                                <p style={styles.sectionLabel}>
                                    BANKING OPERATION
                                </p>

                                <h2 style={styles.modalTitle}>
                                    Deposit Money
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    setShowDeposit(false)
                                }
                                style={styles.closeButton}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleDeposit}>

                            <label style={styles.label}>
                                Account Number
                            </label>

                            <input
                                value={selectedAccount}
                                readOnly
                                style={styles.input}
                            />

                            <label style={styles.label}>
                                Amount
                            </label>

                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                value={depositAmount}
                                onChange={(e) =>
                                    setDepositAmount(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter amount"
                                style={styles.input}
                                required
                            />

                            <div style={styles.modalButtons}>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDeposit(false)
                                    }
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={transactionLoading}
                                    style={{
                                        ...styles.confirmButton,
                                        backgroundColor: "#198754",
                                    }}
                                >
                                    {transactionLoading
                                        ? "Processing..."
                                        : "Deposit"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* WITHDRAW MODAL */}
            {showWithdraw && (
                <div style={styles.modalOverlay}>

                    <div style={styles.modal}>

                        <div style={styles.modalHeader}>
                            <div>
                                <p style={styles.sectionLabel}>
                                    BANKING OPERATION
                                </p>

                                <h2 style={styles.modalTitle}>
                                    Withdraw Money
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    setShowWithdraw(false)
                                }
                                style={styles.closeButton}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleWithdraw}>

                            <label style={styles.label}>
                                Account Number
                            </label>

                            <input
                                value={selectedAccount}
                                readOnly
                                style={styles.input}
                            />

                            <label style={styles.label}>
                                Amount
                            </label>

                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                value={withdrawAmount}
                                onChange={(e) =>
                                    setWithdrawAmount(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter amount"
                                style={styles.input}
                                required
                            />

                            <div style={styles.modalButtons}>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowWithdraw(false)
                                    }
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={transactionLoading}
                                    style={{
                                        ...styles.confirmButton,
                                        backgroundColor: "#dc3545",
                                    }}
                                >
                                    {transactionLoading
                                        ? "Processing..."
                                        : "Withdraw"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* TRANSFER MODAL */}
            {showTransfer && (
                <div style={styles.modalOverlay}>

                    <div style={styles.modal}>

                        <div style={styles.modalHeader}>
                            <div>
                                <p style={styles.sectionLabel}>
                                    BANKING OPERATION
                                </p>

                                <h2 style={styles.modalTitle}>
                                    Transfer Money
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    setShowTransfer(false)
                                }
                                style={styles.closeButton}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleTransfer}>

                            <label style={styles.label}>
                                Sender Account
                            </label>

                            <input
                                value={selectedAccount}
                                readOnly
                                style={styles.input}
                            />

                            <label style={styles.label}>
                                Receiver Account Number
                            </label>

                            <input
                                value={receiverAccount}
                                onChange={(e) =>
                                    setReceiverAccount(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter receiver account"
                                style={styles.input}
                                required
                            />

                            <label style={styles.label}>
                                Amount
                            </label>

                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                value={transferAmount}
                                onChange={(e) =>
                                    setTransferAmount(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter amount"
                                style={styles.input}
                                required
                            />

                            <div style={styles.modalButtons}>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowTransfer(false)
                                    }
                                    style={styles.cancelButton}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={transactionLoading}
                                    style={styles.confirmButton}
                                >
                                    {transactionLoading
                                        ? "Processing..."
                                        : "Transfer"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* TRANSACTION HISTORY */}
            {showTransactions && (
                <div style={styles.modalOverlay}>

                    <div style={styles.transactionModal}>

                        <div style={styles.modalHeader}>

                            <div>
                                <p style={styles.sectionLabel}>
                                    ACCOUNT ACTIVITY
                                </p>

                                <h2 style={styles.modalTitle}>
                                    Transaction History
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    setShowTransactions(false)
                                }
                                style={styles.closeButton}
                            >
                                ×
                            </button>

                        </div>

                        {transactionLoading ? (
                            <div style={styles.transactionLoading}>
                                Loading transactions...
                            </div>
                        ) : transactions.length === 0 ? (
                            <div style={styles.emptyTransactions}>
                                <div style={styles.emptyIcon}>
                                    ≡
                                </div>

                                <h3>
                                    No transactions found
                                </h3>

                                <p>
                                    There are no transactions for
                                    this account yet.
                                </p>
                            </div>
                        ) : (
                            <div style={styles.tableContainer}>

                                <table style={styles.table}>

                                    <thead>
                                        <tr>
                                            <th style={styles.th}>
                                                Type
                                            </th>

                                            <th style={styles.th}>
                                                Amount
                                            </th>

                                            <th style={styles.th}>
                                                Sender
                                            </th>

                                            <th style={styles.th}>
                                                Receiver
                                            </th>

                                            <th style={styles.th}>
                                                Description
                                            </th>

                                            <th style={styles.th}>
                                                Date
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {transactions.map(
                                            (transaction) => (
                                                <tr
                                                    key={
                                                        transaction.id
                                                    }
                                                >
                                                    <td style={styles.td}>
                                                        <span
                                                            style={{
                                                                ...styles.transactionBadge,
                                                                backgroundColor:
                                                                    String(
                                                                        transaction.type
                                                                    ).toUpperCase() ===
                                                                    "DEPOSIT"
                                                                        ? "#e8f7ee"
                                                                        : "#fdecec",
                                                                color:
                                                                    String(
                                                                        transaction.type
                                                                    ).toUpperCase() ===
                                                                    "DEPOSIT"
                                                                        ? "#198754"
                                                                        : "#dc3545",
                                                            }}
                                                        >
                                                            {
                                                                transaction.type
                                                            }
                                                        </span>
                                                    </td>

                                                    <td style={styles.td}>
                                                        <strong>
                                                            ₹
                                                            {formatCurrency(
                                                                transaction.amount
                                                            )}
                                                        </strong>
                                                    </td>

                                                    <td style={styles.td}>
                                                        {
                                                            transaction.senderAccount ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td style={styles.td}>
                                                        {
                                                            transaction.receiverAccount ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td style={styles.td}>
                                                        {
                                                            transaction.description ||
                                                            "-"
                                                        }
                                                    </td>

                                                    <td style={styles.td}>
                                                        {formatDate(
                                                            transaction.transactionDate
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        )}

                    </div>

                </div>
            )}

        </div>
    );
};

const styles = {

    page: {
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
        color: "#1f2937",
        fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },

    header: {
        minHeight: "76px",
        backgroundColor: "#111827",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 5%",
        boxSizing: "border-box",
        gap: "20px",
        flexWrap: "wrap",
    },

    brandSection: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },

    logo: {
        width: "42px",
        height: "42px",
        borderRadius: "10px",
        backgroundColor: "#1769e0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "800",
        fontSize: "20px",
    },

    title: {
        margin: 0,
        fontSize: "19px",
        fontWeight: "700",
    },

    subtitle: {
        margin: "3px 0 0",
        color: "#9ca3af",
        fontSize: "12px",
    },

    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
    },

    userInfo: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
    },

    userAvatar: {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        backgroundColor: "#374151",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "700",
    },

    headerUserName: {
        display: "block",
        fontSize: "13px",
    },

    userRole: {
        display: "block",
        fontSize: "10px",
        color: "#9ca3af",
        marginTop: "2px",
    },

    logoutButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
    },

    container: {
        width: "92%",
        maxWidth: "1250px",
        margin: "0 auto",
        padding: "35px 0 50px",
        boxSizing: "border-box",
    },

    welcomeSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "28px",
        flexWrap: "wrap",
    },

    welcomeLabel: {
        margin: 0,
        fontSize: "11px",
        fontWeight: "700",
        color: "#1769e0",
        letterSpacing: "1.5px",
    },

    welcome: {
        margin: "5px 0 6px",
        fontSize: "32px",
        fontWeight: "750",
        color: "#111827",
    },

    welcomeText: {
        margin: 0,
        color: "#6b7280",
        fontSize: "15px",
    },

    profileButton: {
        backgroundColor: "#6f42c1",
        color: "white",
        border: "none",
        padding: "11px 20px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
    },

    success: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        backgroundColor: "#e8f7ee",
        color: "#146c43",
        border: "1px solid #b7e4c7",
        padding: "13px 16px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "14px",
        fontWeight: "500",
    },

    error: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        backgroundColor: "#fdecec",
        color: "#b42318",
        border: "1px solid #f5c2c7",
        padding: "13px 16px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "14px",
        fontWeight: "500",
    },

    messageIcon: {
        width: "23px",
        height: "23px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.08)",
        fontWeight: "800",
    },

    summaryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "18px",
        marginBottom: "35px",
    },

    summaryCard: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "22px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow:
            "0 2px 12px rgba(15,23,42,0.06)",
        border: "1px solid #edf0f5",
    },

    summaryIcon: {
        width: "50px",
        height: "50px",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "22px",
        fontWeight: "800",
        flexShrink: 0,
    },

    summaryLabel: {
        margin: 0,
        color: "#6b7280",
        fontSize: "10px",
        fontWeight: "700",
        letterSpacing: "1px",
    },

    summaryValue: {
        margin: "5px 0 2px",
        fontSize: "27px",
        color: "#111827",
    },

    balanceSummary: {
        margin: "5px 0 2px",
        fontSize: "24px",
        color: "#111827",
    },

    statusSummary: {
        margin: "5px 0 2px",
        fontSize: "24px",
        color: "#198754",
    },

    summaryDescription: {
        margin: 0,
        color: "#9ca3af",
        fontSize: "11px",
    },

    section: {
        marginBottom: "32px",
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        marginBottom: "18px",
        flexWrap: "wrap",
    },

    sectionLabel: {
        margin: 0,
        color: "#1769e0",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "1.3px",
    },

    sectionHeading: {
        margin: "4px 0 0",
        fontSize: "23px",
        color: "#111827",
    },

    createAccountButton: {
        backgroundColor: "#1769e0",
        color: "white",
        border: "none",
        padding: "11px 18px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
    },

    accountGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
    },

    accountCard: {
        backgroundColor: "white",
        borderRadius: "13px",
        padding: "22px",
        boxShadow:
            "0 2px 12px rgba(15,23,42,0.06)",
        border: "1px solid #edf0f5",
    },

    accountTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "10px",
        marginBottom: "20px",
    },

    accountTypeLabel: {
        margin: 0,
        color: "#1769e0",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "1px",
    },

    cardTitle: {
        margin: "4px 0 0",
        color: "#111827",
        fontSize: "18px",
    },

    statusBadge: {
        padding: "6px 9px",
        borderRadius: "20px",
        fontSize: "10px",
        fontWeight: "800",
        whiteSpace: "nowrap",
    },

    accountNumberBox: {
        padding: "14px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        marginBottom: "12px",
    },

    smallLabel: {
        display: "block",
        color: "#9ca3af",
        fontSize: "9px",
        fontWeight: "800",
        letterSpacing: "1px",
        marginBottom: "5px",
    },

    accountNumber: {
        color: "#374151",
        fontSize: "14px",
        letterSpacing: "0.5px",
    },

    balanceBox: {
        padding: "17px",
        backgroundColor: "#f0f7ff",
        borderRadius: "8px",
        marginBottom: "14px",
    },

    balance: {
        margin: "5px 0 0",
        fontSize: "27px",
        color: "#1769e0",
    },

    selectAccountButton: {
        width: "100%",
        border: "none",
        padding: "11px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "700",
    },

    selectorBox: {
        backgroundColor: "white",
        padding: "22px",
        borderRadius: "12px",
        marginBottom: "32px",
        boxShadow:
            "0 2px 12px rgba(15,23,42,0.06)",
        border: "1px solid #edf0f5",
    },

    selectorTitle: {
        margin: "4px 0 3px",
        fontSize: "20px",
    },

    selectorDescription: {
        margin: 0,
        color: "#6b7280",
        fontSize: "13px",
    },

    label: {
        display: "block",
        fontWeight: "700",
        marginBottom: "8px",
        marginTop: "15px",
        color: "#374151",
        fontSize: "13px",
    },

    select: {
        width: "100%",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        fontSize: "14px",
        boxSizing: "border-box",
        backgroundColor: "white",
        outline: "none",
    },

    actions: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "15px",
    },

    actionButton: {
        minHeight: "75px",
        border: "none",
        borderRadius: "10px",
        color: "white",
        cursor: "pointer",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "15px 17px",
        textAlign: "left",
        boxShadow:
            "0 3px 10px rgba(15,23,42,0.10)",
    },

    actionIcon: {
        width: "35px",
        height: "35px",
        borderRadius: "8px",
        backgroundColor: "rgba(255,255,255,0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "19px",
        fontWeight: "800",
        flexShrink: 0,
    },

    actionButtonSmall: {
        display: "block",
    },

    securityCard: {
        backgroundColor: "#eef4ff",
        border: "1px solid #dbe7ff",
        borderRadius: "12px",
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },

    securityIcon: {
        width: "42px",
        height: "42px",
        borderRadius: "10px",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "20px",
        flexShrink: 0,
    },

    securityTitle: {
        margin: 0,
        fontSize: "15px",
        color: "#1e3a8a",
    },

    securityText: {
        margin: "4px 0 0",
        color: "#53647d",
        fontSize: "12px",
        lineHeight: "1.5",
    },

    noAccount: {
        backgroundColor: "white",
        padding: "45px 25px",
        borderRadius: "13px",
        textAlign: "center",
        boxShadow:
            "0 2px 12px rgba(15,23,42,0.06)",
        border: "1px solid #edf0f5",
    },

    emptyIcon: {
        width: "55px",
        height: "55px",
        borderRadius: "14px",
        margin: "0 auto 15px",
        backgroundColor: "#eef4ff",
        color: "#1769e0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "25px",
    },

    emptyTitle: {
        margin: "0 0 7px",
        color: "#111827",
        fontSize: "20px",
    },

    emptyText: {
        margin: "0 auto 20px",
        maxWidth: "480px",
        color: "#6b7280",
        fontSize: "14px",
        lineHeight: "1.6",
    },

    emptyButton: {
        backgroundColor: "#1769e0",
        color: "white",
        border: "none",
        padding: "11px 20px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
    },

    loadingContainer: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fb",
    },

    loadingCard: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "14px",
        textAlign: "center",
        boxShadow:
            "0 4px 20px rgba(15,23,42,0.08)",
        width: "90%",
        maxWidth: "360px",
    },

    spinner: {
        width: "35px",
        height: "35px",
        border: "4px solid #e5e7eb",
        borderTop: "4px solid #1769e0",
        borderRadius: "50%",
        margin: "0 auto 18px",
        animation: "spin 1s linear infinite",
    },

    loadingTitle: {
        margin: 0,
        fontSize: "19px",
    },

    loadingText: {
        color: "#6b7280",
        fontSize: "13px",
    },

    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15,23,42,0.60)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        zIndex: 1000,
        backdropFilter: "blur(3px)",
    },

    modal: {
        backgroundColor: "white",
        padding: "28px",
        borderRadius: "14px",
        width: "100%",
        maxWidth: "450px",
        boxSizing: "border-box",
        boxShadow:
            "0 20px 50px rgba(0,0,0,0.20)",
    },

    modalTitle: {
        margin: "4px 0 0",
        fontSize: "21px",
        color: "#111827",
    },

    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "15px",
        gap: "15px",
    },

    closeButton: {
        border: "none",
        backgroundColor: "#f3f4f6",
        color: "#374151",
        width: "34px",
        height: "34px",
        borderRadius: "7px",
        fontSize: "23px",
        cursor: "pointer",
        lineHeight: "1",
    },

    input: {
        width: "100%",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        boxSizing: "border-box",
        fontSize: "14px",
        outline: "none",
    },

    modalButtons: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "25px",
    },

    cancelButton: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "7px",
        backgroundColor: "#6b7280",
        color: "white",
        cursor: "pointer",
        fontWeight: "600",
    },

    confirmButton: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "7px",
        backgroundColor: "#1769e0",
        color: "white",
        cursor: "pointer",
        fontWeight: "600",
    },

    transactionModal: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "14px",
        width: "95%",
        maxWidth: "1150px",
        maxHeight: "82vh",
        overflow: "auto",
        boxSizing: "border-box",
        boxShadow:
            "0 20px 50px rgba(0,0,0,0.20)",
    },

    transactionLoading: {
        padding: "50px",
        textAlign: "center",
        color: "#6b7280",
    },

    emptyTransactions: {
        padding: "40px",
        textAlign: "center",
        color: "#6b7280",
    },

    tableContainer: {
        overflowX: "auto",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "850px",
    },

    th: {
        backgroundColor: "#111827",
        color: "white",
        padding: "13px",
        textAlign: "left",
        fontSize: "12px",
        whiteSpace: "nowrap",
    },

    td: {
        padding: "13px",
        borderBottom: "1px solid #edf0f5",
        fontSize: "12px",
        color: "#4b5563",
    },

    transactionBadge: {
        display: "inline-block",
        padding: "5px 8px",
        borderRadius: "15px",
        fontSize: "10px",
        fontWeight: "800",
    },
};

export default Dashboard;
