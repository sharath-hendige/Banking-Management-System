# Banking Management System

A secure full-stack digital banking application built using Java, Spring Boot, Spring Security, JWT, MySQL and React.

## Project Status

The project currently includes:

- Customer registration and login
- JWT authentication
- User dashboard
- Bank account creation
- Account management
- Deposit
- Withdrawal
- Fund transfer
- Transaction history
- Administrator dashboard
- User activation/deactivation
- Account activation/deactivation
- Transaction monitoring
- Transaction filtering
- Account filtering
- Administrator audit logging
- Role-based access control

## Technology Stack

### Backend

- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Maven
- MySQL

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Database

- MySQL

## Architecture

```text
React Frontend
      |
      | REST API
      v
Spring Boot Backend
      |
      +-- Spring Security
      +-- JWT Authentication
      +-- REST Controllers
      +-- Service Layer
      +-- JPA Repositories
      |
      v
    MySQL