package com.sharath.banking_management_system.service;

import java.math.BigDecimal;
import java.util.List;

import com.sharath.banking_management_system.entity.Transaction;

public interface TransactionService {

    Transaction deposit(
            String accountNumber,
            BigDecimal amount
    );

    Transaction withdraw(
            String accountNumber,
            BigDecimal amount
    );

    Transaction transfer(
            String senderAccountNumber,
            String receiverAccountNumber,
            BigDecimal amount
    );

    List<Transaction> getTransactionHistory(
            String accountNumber
    );

    // ADMIN
    List<Transaction> getAllTransactions();
}