package com.sharath.banking_management_system.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sharath.banking_management_system.dto.request.DepositRequest;
import com.sharath.banking_management_system.dto.request.TransferRequest;
import com.sharath.banking_management_system.dto.request.WithdrawRequest;
import com.sharath.banking_management_system.entity.Transaction;
import com.sharath.banking_management_system.service.TransactionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/deposit")
    public ResponseEntity<Transaction> deposit(
            @Valid @RequestBody DepositRequest request) {

        return ResponseEntity.ok(
                transactionService.deposit(
                        request.getAccountNumber(),
                        request.getAmount()
                )
        );
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Transaction> withdraw(
            @Valid @RequestBody WithdrawRequest request) {

        return ResponseEntity.ok(
                transactionService.withdraw(
                        request.getAccountNumber(),
                        request.getAmount()
                )
        );
    }

    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transfer(
            @Valid @RequestBody TransferRequest request) {

        return ResponseEntity.ok(
                transactionService.transfer(
                        request.getSenderAccountNumber(),
                        request.getReceiverAccountNumber(),
                        request.getAmount()
                )
        );
    }

    @GetMapping("/history/{accountNumber}")
    public ResponseEntity<List<Transaction>> history(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                transactionService.getTransactionHistory(accountNumber)
        );
    }
}