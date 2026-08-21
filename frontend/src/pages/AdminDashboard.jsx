import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:9090";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userAccounts, setUserAccounts] = useState([]);
    const [userTransactions, setUserTransactions] = useState([]);

    const [userDetailsLoading, setUserDetailsLoading] = useState(false);
    const [userDetailsError, setUserDetailsError] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [accounts, setAccounts] = useState([]);
    const [accountsLoading, setAccountsLoading] = useState(false);
    const [accountsError, setAccountsError] = useState("");

    const [accountSearch, setAccountSearch] = useState("");
    const [accountStatusFilter, setAccountStatusFilter] = useState("ALL");
    const [accountTypeFilter, setAccountTypeFilter] = useState("ALL");

    const [transactions, setTransactions] = useState([]);
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [transactionError, setTransactionError] = useState("");
    const [transactionSearch, setTransactionSearch] = useState("");
    const [transactionType, setTransactionType] = useState("ALL");

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAccounts: 0,
        activeAccounts: 0,
        totalTransactions: 0,
        totalBalance: 0,
    });

    useEffect(() => {
        fetchUsers();
        fetchAccounts();
        fetchTransactions();
    }, []);

    useEffect(() => {
        calculateStats(users, accounts, transactions);
    }, [users, accounts, transactions]);

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const logoutAndRedirect = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const getHeaders = () => {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        };
    };

    
const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    return (
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.mobile?.toLowerCase().includes(search)
    );
});

const filteredAccounts = accounts.filter((account) => {

    const search = accountSearch.toLowerCase();

    const matchesSearch =
        String(account.id || "")
            .toLowerCase()
            .includes(search) ||

        String(account.accountNumber || "")
            .toLowerCase()
            .includes(search);

    const matchesStatus =
        accountStatusFilter === "ALL" ||
        String(account.status || "").toUpperCase() ===
            accountStatusFilter;

    const matchesType =
        accountTypeFilter === "ALL" ||
        String(account.accountType || "").toUpperCase() ===
            accountTypeFilter;

    return (
        matchesSearch &&
        matchesStatus &&
        matchesType
    );
});

const filteredTransactions = transactions.filter((transaction) => {

    const search = transactionSearch.toLowerCase();

    const matchesSearch =
        String(transaction.id || "")
            .toLowerCase()
            .includes(search) ||

        String(transaction.type || "")
            .toLowerCase()
            .includes(search) ||

        String(transaction.senderAccount || "")
            .toLowerCase()
            .includes(search) ||

        String(transaction.receiverAccount || "")
            .toLowerCase()
            .includes(search) ||

        String(transaction.description || "")
            .toLowerCase()
            .includes(search);

    const matchesType =
        transactionType === "ALL" ||
        String(transaction.type || "").toUpperCase() ===
            transactionType;

    return matchesSearch && matchesType;
});

    // ==============================
    // FETCH USERS
    // ==============================

    const fetchUsers = async () => {
        const token = getToken();

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/api/admin/users`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            if (response.status === 401) {
                logoutAndRedirect();
                return;
            }

            if (response.status === 403) {
                setError(
                    "Access denied. Administrator privileges are required."
                );
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load users.");
            }

            const data = await response.json();

            console.log("ADMIN USERS RESPONSE:", data);

            setUsers(data);

        } catch (err) {
            console.error(err);

            setError(
                err.message || "Unable to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // FETCH ACCOUNTS
    // ==============================

    const fetchAccounts = async () => {
        const token = getToken();

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setAccountsLoading(true);
            setAccountsError("");

            const response = await fetch(
                `${API_BASE_URL}/api/admin/accounts`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            if (response.status === 401) {
                logoutAndRedirect();
                return;
            }

            if (response.status === 403) {
                setAccountsError(
                    "You are not authorized to view accounts."
                );
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load accounts.");
            }

            const data = await response.json();

            setAccounts(data);

        } catch (err) {
            console.error("Accounts error:", err);

            setAccountsError(
                err.message || "Unable to load accounts."
            );

        } finally {
            setAccountsLoading(false);
        }
    };


    // ==============================
    // FETCH TRANSACTIONS
    // ==============================

    const fetchTransactions = async () => {
        const token = getToken();

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setTransactionLoading(true);
            setTransactionError("");

            const response = await fetch(
                `${API_BASE_URL}/api/admin/transactions`,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            if (response.status === 401) {
                logoutAndRedirect();
                return;
            }

            if (response.status === 403) {
                setTransactionError(
                    "You are not authorized to view transactions."
                );
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Failed to load transactions."
                );
            }

            const data = await response.json();

            setTransactions(data);

        } catch (err) {
            console.error(err);

            setTransactionError(
                err.message ||
                "Unable to load transactions."
            );

        } finally {
            setTransactionLoading(false);
        }
    };


    // ==============================
    // VIEW USER DETAILS
    // ==============================

    const viewUserDetails = async (user, type) => {
        const token = getToken();

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setSelectedUser(user);
            setUserDetailsLoading(true);
            setUserDetailsError("");

            setUserAccounts([]);
            setUserTransactions([]);

            let endpoint = "";

            if (type === "accounts") {
                endpoint =
                    `${API_BASE_URL}/api/admin/users/${user.id}/accounts`;
            } else {
                endpoint =
                    `${API_BASE_URL}/api/admin/users/${user.id}/transactions`;
            }

            const response = await fetch(
                endpoint,
                {
                    method: "GET",
                    headers: getHeaders(),
                }
            );

            if (response.status === 401) {
                logoutAndRedirect();
                return;
            }

            if (response.status === 403) {
                throw new Error(
                    "Access denied. Admin privileges required."
                );
            }

            if (!response.ok) {
                throw new Error(
                    type === "accounts"
                        ? "Failed to load user accounts."
                        : "Failed to load user transactions."
                );
            }

            const data = await response.json();

            if (type === "accounts") {
                setUserAccounts(data);
            } else {
                setUserTransactions(data);
            }

        } catch (err) {
            console.error(err);

            setUserDetailsError(
                err.message ||
                "Unable to load user details."
            );

        } finally {
            setUserDetailsLoading(false);
        }
    };

    // ==============================
    // ACCOUNT STATUS
    // ==============================

    const toggleAccountStatus = async (account) => {
        const token = getToken();

        if (!token) {
            navigate("/login");
            return;
        }

        const action =
            account.status === "ACTIVE"
                ? "deactivate"
                : "activate";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} account ${account.accountNumber}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setAccountsError("");

            const response = await fetch(
                `${API_BASE_URL}/api/admin/accounts/${account.id}/${action}`,
                {
                    method: "PUT",
                    headers: getHeaders(),
                }
            );

            if (response.status === 401) {
                logoutAndRedirect();
                return;
            }

            if (response.status === 403) {
                setAccountsError(
                    "Access denied. Administrator privileges required."
                );
                return;
            }

            if (!response.ok) {
                throw new Error(
                    `Failed to ${action} account.`
                );
            }

            const updatedAccount =
                await response.json();

            setAccounts((previousAccounts) =>
                previousAccounts.map((item) =>
                    item.id === updatedAccount.id
                        ? updatedAccount
                        : item
                )
            );

            // Also update selected user's account list
            setUserAccounts((previousAccounts) =>
                previousAccounts.map((item) =>
                    item.id === updatedAccount.id
                        ? updatedAccount
                        : item
                )
            );

        } catch (err) {
            console.error(err);

            setAccountsError(
                err.message ||
                "Unable to update account status."
            );
        }
    };

    // ==============================
    // STATISTICS
    // ==============================

    const calculateStats = (
        usersData,
        accountsData,
        transactionsData
    ) => {
        const activeAccounts =
            accountsData.filter(
                (account) =>
                    account.status?.toUpperCase() ===
                    "ACTIVE"
            );

        const totalBalance =
            accountsData.reduce(
                (total, account) =>
                    total +
                    Number(account.balance || 0),
                0
            );

        setStats({
            totalUsers: usersData.length,
            totalAccounts: accountsData.length,
            activeAccounts: activeAccounts.length,
            totalTransactions:
                transactionsData.length,
            totalBalance,
        });
    };

    // ==============================
    // LOGOUT
    // ==============================

    const handleLogout = () => {
        logoutAndRedirect();
    };

    // ==============================
    // FORMAT DATE
    // ==============================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString();
    };

    // ==============================
    // LOADING
    // ==============================

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingCard}>
                    <div style={styles.loadingIcon}>
                        🏦
                    </div>

                    <h2>
                        Loading Admin Dashboard
                    </h2>

                    <p>
                        Please wait while we load
                        your banking data...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>

            {/* =================================
                HEADER
            ================================= */}

            <header style={styles.header}>

                <div style={styles.brandArea}>

                    <div style={styles.logo}>
                        B
                    </div>

                    <div>
                        <h2 style={styles.title}>
                            Banking Management System
                        </h2>

                        <p style={styles.adminText}>
                            Administrator Dashboard
                        </p>
                    </div>

                </div>

                <div style={styles.headerRight}>

                    <div style={styles.adminBadge}>
                        <span>🛡️</span>
                        ADMIN
                    </div>

                    <button
                        onClick={handleLogout}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>

                </div>

            </header>

            {/* =================================
                MAIN
            ================================= */}

            <main style={styles.container}>

                {/* PAGE INTRO */}

                <div style={styles.pageIntro}>

                    <div>
                        <p style={styles.overline}>
                            ADMINISTRATION
                        </p>

                        <h1 style={styles.heading}>
                            Admin Dashboard
                        </h1>

                        <p style={styles.subtitle}>
                            Monitor users, accounts and
                            banking transactions.
                        </p>
                    </div>

                    <div style={styles.systemStatus}>
                        <span style={styles.statusDot}></span>

                        <div>
                            <strong>
                                System Operational
                            </strong>

                            <small>
                                All banking services active
                            </small>
                        </div>
                    </div>

                </div>

                {/* ERROR */}

                {error && (
                    <div style={styles.error}>
                        <span style={styles.messageIcon}>
                            ⚠️
                        </span>

                        <div>
                            <strong>
                                Something went wrong
                            </strong>

                            <p>
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* =================================
                    STATISTICS
                ================================= */}

                <section style={styles.statsGrid}>

                    {/* USERS */}

                    <div style={styles.statCard}>

                        <div
                            style={{
                                ...styles.statIcon,
                                ...styles.usersIcon,
                            }}
                        >
                            👥
                        </div>

                        <div style={styles.statContent}>

                            <p style={styles.statLabel}>
                                TOTAL USERS
                            </p>

                            <h2 style={styles.statNumber}>
                                {stats.totalUsers}
                            </h2>

                            <span style={styles.statDescription}>
                                Registered customers
                            </span>

                        </div>

                    </div>

                    {/* ACCOUNTS */}

                    <div style={styles.statCard}>

                        <div
                            style={{
                                ...styles.statIcon,
                                ...styles.accountsIcon,
                            }}
                        >
                            🏦
                        </div>

                        <div style={styles.statContent}>

                            <p style={styles.statLabel}>
                                TOTAL ACCOUNTS
                            </p>

                            <h2 style={styles.statNumber}>
                                {stats.totalAccounts}
                            </h2>

                            <span style={styles.statDescription}>
                                Banking accounts
                            </span>

                        </div>

                    </div>

                    {/* ACTIVE */}

                    <div style={styles.statCard}>

                        <div
                            style={{
                                ...styles.statIcon,
                                ...styles.activeIcon,
                            }}
                        >
                            ✓
                        </div>

                        <div style={styles.statContent}>

                            <p style={styles.statLabel}>
                                ACTIVE ACCOUNTS
                            </p>

                            <h2 style={styles.statNumber}>
                                {stats.activeAccounts}
                            </h2>

                            <span style={styles.statDescription}>
                                Currently active
                            </span>

                        </div>

                    </div>

                    {/* TRANSACTIONS */}

                    <div style={styles.statCard}>

                        <div
                            style={{
                                ...styles.statIcon,
                                ...styles.transactionIcon,
                            }}
                        >
                            ⇄
                        </div>

                        <div style={styles.statContent}>

                            <p style={styles.statLabel}>
                                TRANSACTIONS
                            </p>

                            <h2 style={styles.statNumber}>
                                {stats.totalTransactions}
                            </h2>

                            <span style={styles.statDescription}>
                                Total transactions
                            </span>

                        </div>

                    </div>


                </section>

                {/* BALANCE */}

                <div style={styles.balanceSummary}>

                    <div>

                        <p style={styles.statLabel}>
                            TOTAL BANK BALANCE
                        </p>

                        <h2 style={styles.balanceAmount}>
                            ₹{" "}
                            {stats.totalBalance.toLocaleString(
                                "en-IN",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}
                        </h2>

                        <span style={styles.balanceDescription}>
                            Combined balance across all accounts
                        </span>

                    </div>

                    <div style={styles.balanceIcon}>
                        ₹
                    </div>

                </div>

                {/* =================================
                    USERS SECTION
                ================================= */}

                <section style={styles.section}>

                    <div style={styles.sectionHeader}>

                        <div>

                            <p style={styles.sectionOverline}>
                                CUSTOMER MANAGEMENT
                            </p>

                            <h2 style={styles.sectionTitle}>
                                Registered Users
                            </h2>

                        </div>

                        <button
                            onClick={fetchUsers}
                            style={styles.refreshButton}
                        >
                            ↻ Refresh
                        </button>

                    </div>

                    {/* SEARCH */}

                    <div style={styles.searchBox}>

                        <span style={styles.searchIcon}>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search by name, email or mobile..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                            style={styles.searchInput}
                        />

                        {searchTerm && (
                            <button
                                onClick={() =>
                                    setSearchTerm("")
                                }
                                style={styles.clearSearch}
                            >
                                ×
                            </button>
                        )}

                    </div>

                    {filteredUsers.length === 0 ? (

                        <div style={styles.empty}>
                            <div style={styles.emptyIcon}>
                                👤
                            </div>

                            <h3>
                                No users found
                            </h3>

                            <p>
                                Try changing your search
                                criteria.
                            </p>
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
                                            User
                                        </th>

                                        <th style={styles.th}>
                                            Email
                                        </th>

                                        <th style={styles.th}>
                                            Mobile
                                        </th>

                                        <th style={styles.th}>
                                            Role
                                        </th>

                                        <th style={styles.th}>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredUsers.map(
                                        (user) => (

                                        <tr
                                            key={user.id}
                                            style={styles.tr}
                                        >

                                            <td style={styles.td}>
                                                <span
                                                    style={
                                                        styles.idBadge
                                                    }
                                                >
                                                    #{user.id}
                                                </span>
                                            </td>

                                            <td style={styles.td}>

                                                <div
                                                    style={
                                                        styles.userCell
                                                    }
                                                >

                                                    <div
                                                        style={
                                                            styles.avatar
                                                        }
                                                    >
                                                        {(
                                                            user.name ||
                                                            user.email ||
                                                            "U"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {user.name ||
                                                            "Unnamed User"}
                                                    </strong>

                                                </div>

                                            </td>

                                            <td style={styles.td}>
                                                {user.email ||
                                                    "-"}
                                            </td>

                                            <td style={styles.td}>
                                                {user.mobile ||
                                                    "-"}
                                            </td>

                                            <td style={styles.td}>

                                                <span
                                                    style={
                                                        user.role?.toUpperCase() ===
                                                        "ADMIN"
                                                            ? styles.adminRole
                                                            : styles.userRole
                                                    }
                                                >
                                                    {user.role ||
                                                        "USER"}
                                                </span>

                                            </td>

                                            <td style={styles.td}>

                                                <div
                                                    style={
                                                        styles.actionGroup
                                                    }
                                                >

                                                    <button
        onClick={() => setSelectedUser(user)}
        style={styles.detailsButton}
    >
        View Details
    </button>

    <button
        onClick={() =>
            viewUserDetails(user, "accounts")
        }
        style={styles.viewButton}
    >
        Accounts
    </button>

    <button
        onClick={() =>
            viewUserDetails(user, "transactions")
        }
        style={styles.transactionButton}
    >
        Transactions
    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

                {/* =================================
                    SELECTED USER DETAILS
                ================================= */}

                {selectedUser && (

                    <section style={styles.detailSection}>

                        <div style={styles.sectionHeader}>

                            <div>

                                <p style={styles.sectionOverline}>
                                    USER MANAGEMENT
                                </p>

                                <h2 style={styles.sectionTitle}>
                                    {selectedUser.name ||
                                        "User"}{" "}
                                    Details
                                </h2>

                            </div>

                            <button
                                onClick={() => {
                                    setSelectedUser(null);
                                    setUserAccounts([]);
                                    setUserTransactions([]);
                                    setUserDetailsError("");
                                }}
                                style={styles.closeButton}
                            >
                                × Close
                            </button>

                        </div>

                        <div style={styles.userInfoGrid}>

    {/* USER ID */}
    <div>
        <span style={styles.infoLabel}>
            User ID
        </span>

        <strong>
            #{selectedUser.id}
        </strong>
    </div>

    {/* NAME */}
    <div>
        <span style={styles.infoLabel}>
            Name
        </span>

        <strong>
            {selectedUser.name || "-"}
        </strong>
    </div>

    {/* EMAIL */}
    <div>
        <span style={styles.infoLabel}>
            Email
        </span>

        <strong>
            {selectedUser.email || "-"}
        </strong>
    </div>

    {/* MOBILE */}
    <div>
        <span style={styles.infoLabel}>
            Mobile
        </span>

        <strong>
            {selectedUser.mobile || "-"}
        </strong>
    </div>

    {/* ROLE */}
    <div>
        <span style={styles.infoLabel}>
            Role
        </span>

        <span
            style={
                selectedUser.role?.toUpperCase() === "ADMIN"
                    ? styles.adminRole
                    : styles.userRole
            }
        >
            {selectedUser.role || "USER"}
        </span>
    </div>

    {/* STATUS */}
    <div>
        <span style={styles.infoLabel}>
            Status
        </span>

        <span
            style={
                selectedUser.status?.toUpperCase() === "ACTIVE"
                    ? styles.activeStatus
                    : styles.inactiveStatus
            }
        >
            {selectedUser.status || "ACTIVE"}
        </span>
    </div>

</div>

                        {userDetailsLoading && (
                            <div style={styles.inlineLoading}>
                                Loading user details...
                            </div>
                        )}

                        {userDetailsError && (
                            <div style={styles.error}>
                                {userDetailsError}
                            </div>
                        )}

                        {/* USER ACCOUNTS */}

                        {!userDetailsLoading &&
                            userAccounts.length > 0 && (

                            <div style={styles.subSection}>

                                <h3 style={styles.subTitle}>
                                    🏦 User Accounts
                                </h3>

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
                                                    Type
                                                </th>

                                                <th style={styles.th}>
                                                    Balance
                                                </th>

                                                <th style={styles.th}>
                                                    Status
                                                </th>

                                                <th style={styles.th}>
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {userAccounts.map(
                                                (account) => (

                                                <tr
                                                    key={account.id}
                                                >

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        {account.id}
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        <strong>
                                                            {
                                                                account.accountNumber
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        {
                                                            account.accountType
                                                        }
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >
                                                        ₹{" "}
                                                        {Number(
                                                            account.balance ||
                                                                0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <span
                                                            style={
                                                                account.status ===
                                                                "ACTIVE"
                                                                    ? styles.activeStatus
                                                                    : styles.inactiveStatus
                                                            }
                                                        >
                                                            ●{" "}
                                                            {
                                                                account.status
                                                            }
                                                        </span>

                                                    </td>

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <button
                                                            onClick={() =>
                                                                toggleAccountStatus(
                                                                    account
                                                                )
                                                            }
                                                            style={
                                                                account.status ===
                                                                "ACTIVE"
                                                                    ? styles.deactivateButton
                                                                    : styles.activateButton
                                                            }
                                                        >
                                                            {account.status ===
                                                            "ACTIVE"
                                                                ? "Deactivate"
                                                                : "Activate"}
                                                        </button>

                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            </div>
                        )}

                        {/* USER TRANSACTIONS */}

                        {!userDetailsLoading &&
                            userTransactions.length > 0 && (

                            <div style={styles.subSection}>

                                <h3 style={styles.subTitle}>
                                    ⇄ User Transactions
                                </h3>

                                <div style={styles.tableContainer}>

                                    <table style={styles.table}>

                                        <thead>

                                            <tr>

                                                <th style={styles.th}>
                                                    ID
                                                </th>

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

                                            {userTransactions.map(
                                                (transaction) => (

                                                <tr
                                                    key={
                                                        transaction.id
                                                    }
                                                >

                                                    <td style={styles.td}>
                                                        {
                                                            transaction.id
                                                        }
                                                    </td>

                                                    <td style={styles.td}>
                                                        {
                                                            transaction.type
                                                        }
                                                    </td>

                                                    <td style={styles.td}>
                                                        ₹{" "}
                                                        {transaction.amount}
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

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            </div>
                        )}

                        {!userDetailsLoading &&
                            userAccounts.length === 0 &&
                            userTransactions.length === 0 &&
                            !userDetailsError && (

                            <div style={styles.empty}>
                                No records found for this user.
                            </div>
                        )}

                    </section>
                )}

                {/* =================================
                    ALL ACCOUNTS
                ================================= */}

                <section style={styles.section}>

                    <div style={styles.sectionHeader}>

                        <div>

                            <p style={styles.sectionOverline}>
                                BANKING MANAGEMENT
                            </p>

                            <h2 style={styles.sectionTitle}>
                                All Accounts
                            </h2>

                        </div>

                        <button
                            onClick={fetchAccounts}
                            style={styles.refreshButton}
                        >
                            ↻ Refresh
                        </button>

                    </div>

                                        {/* ACCOUNT FILTERS */}

                    <div style={styles.transactionFilters}>

                        <input
                            type="text"
                            placeholder="Search account..."
                            value={accountSearch}
                            onChange={(e) =>
                                setAccountSearch(
                                    e.target.value
                                )
                            }
                            style={styles.searchInput}
                        />

                        <select
                            value={accountStatusFilter}
                            onChange={(e) =>
                                setAccountStatusFilter(
                                    e.target.value
                                )
                            }
                            style={styles.filterSelect}
                        >
                            <option value="ALL">
                                All Status
                            </option>

                            <option value="ACTIVE">
                                Active
                            </option>

                            <option value="INACTIVE">
                                Inactive
                            </option>
                        </select>

                        <select
                            value={accountTypeFilter}
                            onChange={(e) =>
                                setAccountTypeFilter(
                                    e.target.value
                                )
                            }
                            style={styles.filterSelect}
                        >
                            <option value="ALL">
                                All Types
                            </option>

                            <option value="SAVINGS">
                                Savings
                            </option>

                            <option value="CURRENT">
                                Current
                            </option>
                        </select>

                    </div>

                    <div
    style={{
        marginBottom: "15px",
        color: "#64748b",
        fontSize: "13px",
        fontWeight: "600",
    }}
>
    Showing {filteredAccounts.length} of {accounts.length} accounts
</div>

                    {accountsError && (
                        <div style={styles.error}>
                            {accountsError}
                        </div>
                    )}

                    {accountsLoading ? (

                        <div style={styles.inlineLoading}>
                            Loading accounts...
                        </div>

                    ) : accounts.length === 0 ? (

                        <div style={styles.empty}>
                            <div style={styles.emptyIcon}>
                                🏦
                            </div>

                            <h3>
                                No accounts found
                            </h3>
                        </div>

                    ) : filteredAccounts.length === 0 ? (

    <div style={styles.empty}>
        <div style={styles.emptyIcon}>
            🔍
        </div>

        <h3>
            No matching accounts
        </h3>

        <p>
            Try changing your search or filters.
        </p>
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
                                            Type
                                        </th>

                                        <th style={styles.th}>
                                            Balance
                                        </th>

                                        <th style={styles.th}>
                                            Status
                                        </th>

                                        <th style={styles.th}>
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredAccounts.map(
                                        (account) => (

                                        <tr
                                            key={account.id}
                                        >

                                            <td style={styles.td}>
                                                #{account.id}
                                            </td>

                                            <td style={styles.td}>
                                                <strong>
                                                    {
                                                        account.accountNumber
                                                    }
                                                </strong>
                                            </td>

                                            <td style={styles.td}>
                                                {
                                                    account.accountType
                                                }
                                            </td>

                                            <td style={styles.td}>
                                                ₹{" "}
                                                {Number(
                                                    account.balance ||
                                                        0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                            <td style={styles.td}>

                                                <span
                                                    style={
                                                        account.status ===
                                                        "ACTIVE"
                                                            ? styles.activeStatus
                                                            : styles.inactiveStatus
                                                    }
                                                >
                                                    ●{" "}
                                                    {
                                                        account.status
                                                    }
                                                </span>

                                            </td>

                                            <td style={styles.td}>

                                                <button
                                                    onClick={() =>
                                                        toggleAccountStatus(
                                                            account
                                                        )
                                                    }
                                                    style={
                                                        account.status ===
                                                        "ACTIVE"
                                                            ? styles.deactivateButton
                                                            : styles.activateButton
                                                    }
                                                >
                                                    {account.status ===
                                                    "ACTIVE"
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

                {/* =================================
                    TRANSACTIONS
                ================================= */}

                <section style={styles.section}>

                    <div style={styles.sectionHeader}>

                        <div>

                            <p style={styles.sectionOverline}>
                                BANKING ACTIVITY
                            </p>

                            <h2 style={styles.sectionTitle}>
                                Transactions
                            </h2>

                        </div>

                        <button
                            onClick={fetchTransactions}
                            style={styles.refreshButton}
                            disabled={transactionLoading}
                        >
                            {transactionLoading
                                ? "Loading..."
                                : "↻ Refresh"}
                        </button>

                    </div>

                                        {/* TRANSACTION FILTERS */}

                    <div style={styles.transactionFilters}>

                        <input
                            type="text"
                            placeholder="Search ID, account or description..."
                            value={transactionSearch}
                            onChange={(e) =>
                                setTransactionSearch(
                                    e.target.value
                                )
                            }
                            style={styles.searchInput}
                        />

                        <select
                            value={transactionType}
                            onChange={(e) =>
                                setTransactionType(
                                    e.target.value
                                )
                            }
                            style={styles.filterSelect}
                        >
                            <option value="ALL">
                                All Transactions
                            </option>

                            <option value="DEPOSIT">
                                Deposits
                            </option>

                            <option value="WITHDRAW">
                                Withdrawals
                            </option>

                            <option value="TRANSFER">
                                Transfers
                            </option>
                        </select>

                    </div>

                    {transactionError && (
                        <div style={styles.error}>
                            {transactionError}
                        </div>
                    )}

                    {filteredTransactions.length === 0 ? (

                        <div style={styles.empty}>
                            <div style={styles.emptyIcon}>
                                ⇄
                            </div>

                            <h3>
                                No transactions found
                            </h3>
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

                                    {filteredTransactions.map(
                                        (transaction) => (

                                        <tr
                                            key={
                                                transaction.id
                                            }
                                        >

                                            <td style={styles.td}>
                                                #
                                                {
                                                    transaction.id
                                                }
                                            </td>

                                            <td style={styles.td}>

                                                <span
                                                    style={
                                                        styles.transactionType
                                                    }
                                                >
                                                    {
                                                        transaction.type
                                                    }
                                                </span>

                                            </td>

                                            <td style={styles.td}>
                                                <strong>
                                                    ₹{" "}
                                                    {Number(
                                                        transaction.amount ||
                                                            0
                                                    ).toLocaleString(
                                                        "en-IN"
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

                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

                {/* FOOTER */}

                <footer style={styles.footer}>

                    <span>
                        Banking Management System
                    </span>

                    <span>
                        Secure Administrator Portal
                    </span>

                </footer>

            </main>

        </div>
    );
};

const styles = {

    page: {
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        color: "#1e293b",
        fontFamily:
            "Inter, Arial, Helvetica, sans-serif",
    },

    // HEADER

    header: {
        minHeight: "76px",
        backgroundColor: "#0f172a",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 32px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow:
            "0 2px 12px rgba(15,23,42,0.18)",
    },

    brandArea: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
    },

    logo: {
        width: "42px",
        height: "42px",
        borderRadius: "10px",
        backgroundColor: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "21px",
        fontWeight: "800",
    },

    title: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "700",
    },

    adminText: {
        margin: "4px 0 0",
        color: "#94a3b8",
        fontSize: "13px",
    },

    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
    },

    adminBadge: {
        backgroundColor:
            "rgba(37,99,235,0.15)",
        border:
            "1px solid rgba(96,165,250,0.35)",
        color: "#bfdbfe",
        padding: "8px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },

    logoutButton: {
        backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        padding: "10px 18px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
    },

    // MAIN

    container: {
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "34px 30px 50px",
        boxSizing: "border-box",
    },

    pageIntro: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "28px",
    },

    overline: {
        margin: 0,
        color: "#2563eb",
        fontSize: "12px",
        fontWeight: "800",
        letterSpacing: "1.2px",
    },

    heading: {
        margin: "6px 0",
        fontSize: "32px",
        color: "#0f172a",
    },

    subtitle: {
        margin: 0,
        color: "#64748b",
        fontSize: "15px",
    },

    systemStatus: {
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "13px 17px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        boxShadow:
            "0 2px 8px rgba(15,23,42,0.04)",
    },

    statusDot: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "#22c55e",
        display: "inline-block",
    },

    // STATS

    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(230px, 1fr))",
        gap: "18px",
        marginBottom: "18px",
    },

    statCard: {
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "22px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow:
            "0 3px 12px rgba(15,23,42,0.05)",
    },

    statIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "21px",
        flexShrink: 0,
    },

    usersIcon: {
        backgroundColor: "#dbeafe",
    },

    accountsIcon: {
        backgroundColor: "#ede9fe",
    },

    activeIcon: {
        backgroundColor: "#dcfce7",
        color: "#15803d",
    },

    transactionIcon: {
        backgroundColor: "#fef3c7",
    },

    statContent: {
        minWidth: 0,
    },

    statLabel: {
        margin: 0,
        color: "#64748b",
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "0.8px",
    },

    statNumber: {
        margin: "5px 0",
        color: "#0f172a",
        fontSize: "28px",
        fontWeight: "800",
    },

    statDescription: {
        color: "#94a3b8",
        fontSize: "12px",
    },

    // BALANCE

    balanceSummary: {
        backgroundColor: "#1d4ed8",
        color: "white",
        borderRadius: "12px",
        padding: "24px 28px",
        marginBottom: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow:
            "0 6px 20px rgba(29,78,216,0.18)",
    },

    balanceAmount: {
        margin: "7px 0",
        fontSize: "30px",
    },

    balanceDescription: {
        color: "#bfdbfe",
        fontSize: "13px",
    },

    balanceIcon: {
        width: "58px",
        height: "58px",
        borderRadius: "50%",
        backgroundColor:
            "rgba(255,255,255,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "25px",
        fontWeight: "700",
    },

    // SECTIONS

    section: {
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "25px",
        marginBottom: "28px",
        boxShadow:
            "0 3px 12px rgba(15,23,42,0.05)",
    },

    detailSection: {
        backgroundColor: "white",
        border: "2px solid #bfdbfe",
        borderRadius: "12px",
        padding: "25px",
        marginBottom: "28px",
        boxShadow:
            "0 4px 15px rgba(37,99,235,0.08)",
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        marginBottom: "20px",
    },

    sectionOverline: {
        margin: "0 0 4px",
        color: "#2563eb",
        fontSize: "10px",
        fontWeight: "800",
        letterSpacing: "1px",
    },

    sectionTitle: {
        margin: 0,
        fontSize: "21px",
        color: "#0f172a",
    },

    refreshButton: {
        border: "1px solid #cbd5e1",
        backgroundColor: "white",
        color: "#334155",
        padding: "9px 15px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
    },
    

    // SEARCH

    transactionFilters: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
    },

    searchBox: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        marginBottom: "20px",
    },

    searchIcon: {
        position: "absolute",
        left: "14px",
        fontSize: "15px",
    },

    searchInput: {
        width: "100%",
        padding: "13px 42px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        backgroundColor: "#f8fafc",
    },
    filterSelect: {
    padding: "12px 15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    backgroundColor: "white",
    cursor: "pointer",
    },

    clearSearch: {
        position: "absolute",
        right: "10px",
        border: "none",
        backgroundColor: "transparent",
        color: "#64748b",
        fontSize: "22px",
        cursor: "pointer",
    },

    // TABLE

    tableContainer: {
        width: "100%",
        overflowX: "auto",
        border: "1px solid #e2e8f0",
        borderRadius: "9px",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "850px",
    },

    th: {
        backgroundColor: "#f8fafc",
        color: "#475569",
        padding: "13px 14px",
        textAlign: "left",
        fontSize: "11px",
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        borderBottom: "1px solid #e2e8f0",
    },

    td: {
        padding: "14px",
        borderBottom: "1px solid #f1f5f9",
        color: "#475569",
        fontSize: "13px",
        verticalAlign: "middle",
    },

    idBadge: {
        color: "#64748b",
        fontWeight: "700",
    },

    userCell: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },

    avatar: {
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800",
    },

    actionGroup: {
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
    },

    viewButton: {
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600",
    },

    detailsButton: {
    backgroundColor: "#0d6efd",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
    marginBottom: "5px",
    fontSize: "13px",
},

    transactionButton: {
        backgroundColor: "#7c3aed",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600",
    },

    // STATUS

    activeStatus: {
        color: "#15803d",
        backgroundColor: "#dcfce7",
        padding: "5px 9px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "800",
        display: "inline-block",
    },

    inactiveStatus: {
        color: "#b91c1c",
        backgroundColor: "#fee2e2",
        padding: "5px 9px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "800",
        display: "inline-block",
    },

    adminRole: {
        color: "#6d28d9",
        backgroundColor: "#ede9fe",
        padding: "5px 9px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "800",
    },

    userRole: {
        color: "#1d4ed8",
        backgroundColor: "#dbeafe",
        padding: "5px 9px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "800",
    },

    transactionType: {
        color: "#475569",
        backgroundColor: "#f1f5f9",
        padding: "5px 8px",
        borderRadius: "5px",
        fontSize: "11px",
        fontWeight: "700",
    },

    deactivateButton: {
        backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600",
    },

    activateButton: {
        backgroundColor: "#16a34a",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600",
    },

    closeButton: {
        backgroundColor: "#64748b",
        color: "white",
        border: "none",
        padding: "9px 14px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
    },

    // USER DETAILS

    userInfoGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "15px",
        backgroundColor: "#f8fafc",
        padding: "18px",
        borderRadius: "8px",
        marginBottom: "22px",
    },

    infoLabel: {
        display: "block",
        color: "#64748b",
        fontSize: "11px",
        fontWeight: "700",
        marginBottom: "5px",
        textTransform: "uppercase",
    },

    subSection: {
        marginTop: "25px",
    },

    subTitle: {
        color: "#0f172a",
        fontSize: "17px",
        marginBottom: "15px",
    },

    // MESSAGES

    error: {
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#b91c1c",
        padding: "14px 16px",
        borderRadius: "8px",
        marginBottom: "20px",
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
        fontSize: "13px",
    },

    messageIcon: {
        fontSize: "16px",
    },

    empty: {
        padding: "45px 20px",
        textAlign: "center",
        color: "#64748b",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        border: "1px dashed #cbd5e1",
    },

    emptyIcon: {
        fontSize: "30px",
        marginBottom: "8px",
    },

    inlineLoading: {
        padding: "25px",
        textAlign: "center",
        color: "#64748b",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
    },

    // LOADING

    loadingContainer: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1f5f9",
    },

    loadingCard: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "14px",
        textAlign: "center",
        boxShadow:
            "0 8px 30px rgba(15,23,42,0.08)",
    },

    loadingIcon: {
        fontSize: "40px",
        marginBottom: "10px",
    },

    footer: {
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 5px",
        color: "#94a3b8",
        fontSize: "12px",
        borderTop: "1px solid #e2e8f0",
        marginTop: "10px",
    },
};

export default AdminDashboard;