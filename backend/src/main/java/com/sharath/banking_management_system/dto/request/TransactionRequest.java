package com.sharath.banking_management_system.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TransactionRequest {

    @NotNull(message = "Account ID is required")
    private Long accountId;

    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    @SuppressWarnings("unused")
	private Long receiverAccountId;
}