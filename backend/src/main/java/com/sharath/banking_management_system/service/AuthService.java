package com.sharath.banking_management_system.service;

import com.sharath.banking_management_system.dto.request.LoginRequest;
import com.sharath.banking_management_system.dto.request.RegisterRequest;
import com.sharath.banking_management_system.dto.response.JwtResponse;
public interface AuthService {

    void register(RegisterRequest request);

    JwtResponse login(LoginRequest request);

}