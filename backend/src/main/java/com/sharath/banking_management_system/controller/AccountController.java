package com.sharath.banking_management_system.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sharath.banking_management_system.dto.request.AccountRequest;
import com.sharath.banking_management_system.dto.response.AccountResponse;
import com.sharath.banking_management_system.service.AccountService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @Valid @RequestBody AccountRequest request) {

        return ResponseEntity.ok(
                accountService.createAccount(request)
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<AccountResponse>> getMyAccounts() {

        return ResponseEntity.ok(
                accountService.getMyAccounts()
        );
    }
    @GetMapping("/all")
public ResponseEntity<List<AccountResponse>> getAllAccounts() {

    return ResponseEntity.ok(
            accountService.getAllAccounts()
    );
}
}