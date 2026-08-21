package com.sharath.banking_management_system.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sharath.banking_management_system.entity.Account;
import com.sharath.banking_management_system.entity.Transaction;
import com.sharath.banking_management_system.exception.ResourceNotFoundException;
import com.sharath.banking_management_system.repository.AccountRepository;
import com.sharath.banking_management_system.repository.TransactionRepository;
import com.sharath.banking_management_system.service.TransactionService;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(
            AccountRepository accountRepository,
            TransactionRepository transactionRepository) {

        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional
    public Transaction deposit(
            String accountNumber,
            BigDecimal amount) {

        validateAmount(amount);

        Account account = findAccount(accountNumber);

        verifyOwnership(account);

        account.setBalance(
                account.getBalance().add(amount)
        );

        accountRepository.save(account);

        Transaction transaction = new Transaction();

        transaction.setType("DEPOSIT");
        transaction.setAmount(amount);
        transaction.setReceiverAccount(accountNumber);
        transaction.setDescription("Cash deposit");
        transaction.setAccount(account);

        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public Transaction withdraw(
            String accountNumber,
            BigDecimal amount) {

        validateAmount(amount);

        Account account = findAccount(accountNumber);

        verifyOwnership(account);

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setBalance(
                account.getBalance().subtract(amount)
        );

        accountRepository.save(account);

        Transaction transaction = new Transaction();

        transaction.setType("WITHDRAW");
        transaction.setAmount(amount);
        transaction.setSenderAccount(accountNumber);
        transaction.setDescription("Cash withdrawal");
        transaction.setAccount(account);

        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public Transaction transfer(
            String senderAccountNumber,
            String receiverAccountNumber,
            BigDecimal amount) {

        validateAmount(amount);

        if (senderAccountNumber.equals(receiverAccountNumber)) {
            throw new RuntimeException(
                    "Sender and receiver cannot be the same"
            );
        }

        Account sender = findAccount(senderAccountNumber);
        Account receiver = findAccount(receiverAccountNumber);

        // Sender must own the account
        verifyOwnership(sender);

        if (sender.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        sender.setBalance(
                sender.getBalance().subtract(amount)
        );

        receiver.setBalance(
                receiver.getBalance().add(amount)
        );

        accountRepository.save(sender);
        accountRepository.save(receiver);

        Transaction transaction = new Transaction();

        transaction.setType("TRANSFER");
        transaction.setAmount(amount);
        transaction.setSenderAccount(senderAccountNumber);
        transaction.setReceiverAccount(receiverAccountNumber);
        transaction.setDescription("Account transfer");
        transaction.setAccount(sender);

        return transactionRepository.save(transaction);
    }

    @Override
@Transactional(readOnly = true)
public List<Transaction> getTransactionHistory(
        String accountNumber) {

    Account account = findAccount(accountNumber);

    verifyOwnership(account);

    return transactionRepository
            .findTransactionHistory(accountNumber);
}
// ADMIN
@Override
@Transactional(readOnly = true)
public List<Transaction> getAllTransactions() {

    return transactionRepository.findAll();
}


private Account findAccount(String accountNumber) {

    return accountRepository
            .findByAccountNumber(accountNumber)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Account not found: " + accountNumber
                    )
            );
}
    

    private void verifyOwnership(Account account) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String loggedInEmail =
                authentication.getName();

        String accountOwnerEmail =
                account.getUser().getEmail();

        if (!loggedInEmail.equalsIgnoreCase(accountOwnerEmail)) {

            throw new RuntimeException(
                    "You are not authorized to access this account"
            );
        }
    }

    private void validateAmount(BigDecimal amount) {

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Amount must be greater than zero"
            );
        }
    }
    
}