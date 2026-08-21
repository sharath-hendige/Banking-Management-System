package com.sharath.banking_management_system.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sharath.banking_management_system.dto.response.UserResponse;
import com.sharath.banking_management_system.entity.Account;
import com.sharath.banking_management_system.entity.Transaction;
import com.sharath.banking_management_system.entity.User;
import com.sharath.banking_management_system.repository.AccountRepository;
import com.sharath.banking_management_system.repository.TransactionRepository;
import com.sharath.banking_management_system.repository.UserRepository;
import com.sharath.banking_management_system.service.UserService;
import com.sharath.banking_management_system.service.AccountService;
import com.sharath.banking_management_system.service.TransactionService;
import com.sharath.banking_management_system.service.AdminAuditLogService;
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    private final UserService userService;
    private final AdminAuditLogService adminAuditLogService;
    private final AccountService accountService;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;

    public AdminController(
            UserRepository userRepository,
            AccountRepository accountRepository,
            TransactionRepository transactionRepository,
            UserService userService,
            AccountService accountService,
            TransactionService transactionService,
            AdminAuditLogService adminAuditLogService
        ) {

        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.userService = userService;
        this.accountService = accountService;
        this.transactionService = transactionService;
        this.adminAuditLogService = adminAuditLogService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        List<User> users = userRepository.findAll();

        List<UserResponse> response = users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}/accounts")
    public ResponseEntity<List<Account>> getUserAccounts(
            @PathVariable Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + userId
                        )
                );

        List<Account> accounts =
                accountRepository.findByUserEmail(user.getEmail());

        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/users/{userId}/transactions")
    public ResponseEntity<List<Transaction>> getUserTransactions(
            @PathVariable Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + userId
                        )
                );

        List<Account> accounts =
                accountRepository.findByUserEmail(user.getEmail());

        List<Transaction> transactions =
                accounts.stream()
                        .flatMap(account ->
                                transactionRepository
                                        .findTransactionHistory(
                                                account.getAccountNumber()
                                        )
                                        .stream()
                        )
                        .toList();

        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {

        return ResponseEntity.ok(
                transactionService.getAllTransactions()
        );
    }

    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<UserResponse> deactivateUser(
        @PathVariable Long id) {

    return ResponseEntity.ok(
        userService.deactivateUser(id)
    );
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<UserResponse> activateUser(
        @PathVariable Long id) {

    return ResponseEntity.ok(
        userService.activateUser(id)
    );
    }


    private UserResponse convertToUserResponse(User user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setMobile(user.getMobile());

        return response;
    }
}