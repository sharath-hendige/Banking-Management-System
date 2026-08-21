//package com.sharath.banking_management_system.service;
//
//import com.sharath.banking_management_system.dto.request.AccountRequest;
//import com.sun.tools.javac.util.List;
//
//public interface AccountService {
//
//    AccountResponse createAccount(AccountRequest request);
//
//    AccountResponse getAccountById(Long id);
//
//    List getAllAccounts();
//}

package com.sharath.banking_management_system.service;

import com.sharath.banking_management_system.dto.request.AccountRequest;
import com.sharath.banking_management_system.dto.response.AccountResponse;
import java.util.List;

public interface AccountService {

    AccountResponse createAccount(AccountRequest request);

    AccountResponse getAccountById(Long id);

    AccountResponse getAccountByNumber(String accountNumber);
    
    List<AccountResponse> getMyAccounts();

    List<AccountResponse> getAllAccounts();

    // ADMIN
    AccountResponse deactivateAccount(Long id);

    AccountResponse activateAccount(Long id);
}