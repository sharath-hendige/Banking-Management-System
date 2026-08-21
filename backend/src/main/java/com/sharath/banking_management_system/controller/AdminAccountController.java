package com.sharath.banking_management_system.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sharath.banking_management_system.dto.response.AccountResponse;
import com.sharath.banking_management_system.entity.Account;
import com.sharath.banking_management_system.exception.ResourceNotFoundException;
import com.sharath.banking_management_system.repository.AccountRepository;

@RestController
@RequestMapping("/api/admin/accounts")
public class AdminAccountController {

    private final AccountRepository accountRepository;

    public AdminAccountController(
            AccountRepository accountRepository) {

        this.accountRepository = accountRepository;
    }

    // =====================================================
    // GET ALL ACCOUNTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {

        List<AccountResponse> response =
                accountRepository.findAll()
                        .stream()
                        .map(this::convertToResponse)
                        .toList();

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // DEACTIVATE ACCOUNT
    // =====================================================

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<AccountResponse> deactivateAccount(
            @PathVariable Long id) {

        Account account =
                accountRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Account not found with id: " + id
                                )
                        );

        account.setStatus("INACTIVE");

        Account savedAccount =
                accountRepository.save(account);

        return ResponseEntity.ok(
                convertToResponse(savedAccount)
        );
    }

    // =====================================================
    // ACTIVATE ACCOUNT
    // =====================================================

    @PutMapping("/{id}/activate")
    public ResponseEntity<AccountResponse> activateAccount(
            @PathVariable Long id) {

        Account account =
                accountRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Account not found with id: " + id
                                )
                        );

        account.setStatus("ACTIVE");

        Account savedAccount =
                accountRepository.save(account);

        return ResponseEntity.ok(
                convertToResponse(savedAccount)
        );
    }

    // =====================================================
    // CONVERT ENTITY → DTO
    // =====================================================

    private AccountResponse convertToResponse(
            Account account) {

        AccountResponse response =
                new AccountResponse();

        response.setId(account.getId());

        response.setAccountNumber(
                account.getAccountNumber()
        );

        response.setAccountType(
                account.getAccountType()
        );

        response.setBalance(
                account.getBalance()
        );

        response.setStatus(
                account.getStatus()
        );

        return response;
    }
}