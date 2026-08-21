package com.sharath.banking_management_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sharath.banking_management_system.entity.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);

    List<Account> findByUserEmail(String email);

    // ADMIN - get accounts belonging to a specific user
    List<Account> findByUserId(Long userId);
}