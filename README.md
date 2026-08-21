# 🏦 Banking Management System

A full-stack Banking Management System built using **Java, Spring Boot, Spring Security, JWT, MySQL, and React.js**.

The application provides separate functionality for **Users** and **Administrators**, with secure JWT-based authentication and role-based access control.

---

## 📌 Project Overview

The Banking Management System allows customers to manage their bank accounts and transactions through a web application.

Users can:

- Register
- Login securely
- Create bank accounts
- View accounts
- Deposit money
- Withdraw money
- View transactions
- Manage their profile
- Logout securely

Administrators can:

- Login through the admin role
- View registered users
- Search users
- Activate accounts
- Deactivate accounts
- View bank accounts
- View transactions
- Monitor the banking system

---

# 🛠️ Technology Stack

## Backend

- Java 21+
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT Authentication
- Hibernate
- Maven
- MySQL

## Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- React Router
- Vite
- Fetch API

## Database

- MySQL

---

# 🏗️ Project Architecture

```text
                    ┌──────────────────────┐
                    │      React.js        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │     Spring Boot      │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌───────────┐   ┌─────────────┐   ┌───────────┐
        │Controller │   │   Service   │   │ Security  │
        └───────────┘   └─────────────┘   │   + JWT   │
                                          └───────────┘
              │                │
              └────────────────┘
                       │
                       ▼
                ┌─────────────┐
                │ Spring Data │
                │     JPA     │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │    MySQL    │
                │  banking_db │
                └─────────────┘


# Project Structure

 Banking-Management-System/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── sharath/
│   │   │   │           └── banking_management_system/
│   │   │   │               ├── controller/
│   │   │   │               ├── dto/
│   │   │   │               ├── entity/
│   │   │   │               ├── repository/
│   │   │   │               ├── security/
│   │   │   │               └── service/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── banking_db.sql
│
├── screenshots/
│
├── docs/
│
├── README.md
└── LICENSE               

# Authentication

The application uses JWT-based authentication.

User
 │
 ▼
Login
 │
 ▼
Spring Security
 │
 ▼
Validate email/password
 │
 ▼
Generate JWT
 │
 ▼
React stores token
 │
 ▼
Token sent with protected requests
 │
 ▼
JWT Filter
 │
 ▼
Authorized Request