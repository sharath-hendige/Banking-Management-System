import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transfer from "./pages/Transfer";
import TransactionHistory from "./pages/TransactionHistory";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* =========================
                    LOGIN
                ========================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                {/* =========================
                    USER DASHBOARD
                ========================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    ACCOUNTS
                ========================= */}

                <Route
                    path="/accounts"
                    element={
                        <ProtectedRoute>
                            <Accounts />
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    DEPOSIT
                ========================= */}

                <Route
                    path="/deposit"
                    element={
                        <ProtectedRoute>
                            <Deposit />
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    WITHDRAW
                ========================= */}

                <Route
                    path="/withdraw"
                    element={
                        <ProtectedRoute>
                            <Withdraw />
                        </ProtectedRoute>
                    }
                />

                <Route
    path="/transfer"
    element={
        <ProtectedRoute>
            <Transfer />
        </ProtectedRoute>
    }
/>

<Route
    path="/transactions"
    element={
        <ProtectedRoute>
            <TransactionHistory />
        </ProtectedRoute>
    }
/>

                {/* =========================
                    ADMIN DASHBOARD
                ========================= */}

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
    path="/profile"
    element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>

                {/* =========================
                    UNKNOWN URL
                ========================= */}

                <Route
                    path="*"
                    element={
                        <Navigate to="/" replace />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;