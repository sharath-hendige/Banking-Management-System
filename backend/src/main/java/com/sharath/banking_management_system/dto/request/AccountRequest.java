package com.sharath.banking_management_system.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AccountRequest {

    @NotBlank(message = "Account type is required")
    private String accountType;

    public AccountRequest() {
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }
}