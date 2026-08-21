package com.sharath.banking_management_system.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.sharath.banking_management_system.dto.request.AccountRequest;
import com.sharath.banking_management_system.dto.response.AccountResponse;
import com.sharath.banking_management_system.entity.Account;
import com.sharath.banking_management_system.entity.User;
import com.sharath.banking_management_system.exception.ResourceNotFoundException;
import com.sharath.banking_management_system.repository.AccountRepository;
import com.sharath.banking_management_system.repository.UserRepository;
import com.sharath.banking_management_system.service.AccountService;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountServiceImpl(
            AccountRepository accountRepository,
            UserRepository userRepository) {

        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AccountResponse createAccount(AccountRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user not found"
                        )
                );

        Account account = new Account();

        account.setAccountNumber(
                "ACC" + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 10)
        );

        account.setAccountType(request.getAccountType());

        account.setBalance(BigDecimal.ZERO);

        account.setStatus("ACTIVE");

        account.setUser(user);

        Account savedAccount =
                accountRepository.save(account);

        return convertToResponse(savedAccount);
    }

    @Override
    public AccountResponse getAccountById(Long id) {

        Account account =
                accountRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Account not found with id: " + id
                                )
                        );

        return convertToResponse(account);
    }

    @Override
    public AccountResponse getAccountByNumber(
            String accountNumber) {

        Account account =
                accountRepository
                        .findByAccountNumber(accountNumber)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Account not found: "
                                                + accountNumber
                                )
                        );

        return convertToResponse(account);
    }
@Override
public List<AccountResponse> getMyAccounts() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        List<Account> accounts =
                accountRepository.findByUserEmail(email);

        return accounts.stream()
                .map(this::convertToResponse)
                .toList();
}

@Override
public List<AccountResponse> getAllAccounts() {

        List<Account> accounts = accountRepository.findAll();

        return accounts.stream()
                .map(this::convertToResponse)
                .toList();
}

@Override
public AccountResponse deactivateAccount(Long id) {

    Account account = accountRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Account not found with id: " + id
                    )
            );

    account.setStatus("INACTIVE");

    Account updatedAccount = accountRepository.save(account);

    return convertToResponse(updatedAccount);
}

@Override
public AccountResponse activateAccount(Long id) {

    Account account = accountRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Account not found with id: " + id
                    )
            );

    account.setStatus("ACTIVE");

    Account updatedAccount = accountRepository.save(account);

    return convertToResponse(updatedAccount);
}

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