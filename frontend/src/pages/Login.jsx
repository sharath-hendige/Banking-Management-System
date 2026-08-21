import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:9090/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            // Debug - see exactly what backend returns
            console.log("LOGIN RESPONSE:", data);

            if (!response.ok) {
                setError(
                    data.message || "Invalid email or password"
                );
                return;
            }

            const token = data.token;

            if (!token) {
                setError(
                    "JWT token was not received from the server."
                );
                return;
            }

            let role = data.role;

            /*
             * If backend does not directly return role,
             * read it from JWT.
             */
            if (!role) {
                try {
                    const payload = JSON.parse(
                        atob(
                            token
                                .split(".")[1]
                                .replace(/-/g, "+")
                                .replace(/_/g, "/")
                        )
                    );

                    console.log("JWT PAYLOAD:", payload);

                    role = payload.role;
                } catch (jwtError) {
                    console.error(
                        "JWT decode error:",
                        jwtError
                    );
                }
            }

            if (!role) {
                setError(
                    "User role was not received from the server."
                );
                return;
            }

            // Store JWT
            localStorage.setItem(
                "token",
                token
            );

            // Store user information
            const user = {
                email: email,
                role: role
            };

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            console.log(
                "LOGIN SUCCESS:",
                user
            );

            // Redirect based on role
            if (role.toUpperCase() === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }

        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-box">

                <h2>
                    Banking Management System
                </h2>

                <h3>
                    Login
                </h3>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <form onSubmit={handleLogin}>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Login;