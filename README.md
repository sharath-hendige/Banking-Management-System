# 🏦 Banking Management System

A full-stack Banking Management System built using **Java, Spring Boot, Spring Security, JWT, MySQL and React.js**.

The application provides secure banking operations for customers and administrative management features for administrators.

---

## 🚀 Features

### 👤 User Features

- User registration
- Secure user login
- JWT-based authentication
- Role-based authorization
- User profile
- Create bank account
- View bank accounts
- View account balance
- Deposit money
- Withdraw money
- Transfer money
- View transaction history

### 🛡️ Admin Features

- Admin authentication
- View registered users
- Activate user accounts
- Deactivate user accounts
- View user accounts
- View user transactions
- View all transactions
- Activate bank accounts
- Deactivate bank accounts
- Admin audit logging

---

## 🔐 Security

The application uses **Spring Security and JWT authentication**.

Security features include:

- JWT-based authentication
- Role-based access control
- Password encryption using BCrypt
- Protected API endpoints
- Admin-only endpoints
- Protected React routes
- Authentication token validation
- Account status validation

Example:

```text
USER
 ├── /api/accounts/my
 ├── /api/transactions/*
 └── /api/users/*

ADMIN
 ├── /api/admin/users
 ├── /api/admin/users/{id}/activate
 ├── /api/admin/users/{id}/deactivate
 ├── /api/admin/users/{id}/accounts
 └── /api/admin/users/{id}/transactions