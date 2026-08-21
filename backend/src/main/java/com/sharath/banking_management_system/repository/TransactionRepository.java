//package com.sharath.banking_management_system.repository;
//
//import java.util.List;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import com.sharath.banking_management_system.entity.Transaction;
//
//public interface TransactionRepository extends JpaRepository<Transaction, Long> {
//
//    List<Transaction> findByAccountAccountNumberOrSenderAccountOrReceiverAccountOrderByTransactionDateDesc(
//            String accountNumber,
//            String senderAccount,
//            String receiverAccount
//    );
//}

package com.sharath.banking_management_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sharath.banking_management_system.entity.Transaction;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    @Query("""
        SELECT t
        FROM Transaction t
        WHERE t.account.accountNumber = :accountNumber
        ORDER BY t.transactionDate DESC
    """)
    List<Transaction> findTransactionHistory(
            @Param("accountNumber") String accountNumber
    );
    List<Transaction> findAllByOrderByTransactionDateDesc();
}