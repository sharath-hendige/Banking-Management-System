package com.sharath.banking_management_system.service;

import java.util.List;

import com.sharath.banking_management_system.dto.request.UserRequest;
import com.sharath.banking_management_system.dto.response.UserResponse;

public interface UserService {

    UserResponse register(UserRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    // ADMIN
    UserResponse activateUser(Long id);

    UserResponse deactivateUser(Long id);
}