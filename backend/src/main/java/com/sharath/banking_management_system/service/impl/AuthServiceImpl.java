package com.sharath.banking_management_system.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sharath.banking_management_system.dto.request.LoginRequest;
import com.sharath.banking_management_system.dto.request.RegisterRequest;
import com.sharath.banking_management_system.dto.response.JwtResponse;
import com.sharath.banking_management_system.entity.User;
import com.sharath.banking_management_system.repository.UserRepository;
import com.sharath.banking_management_system.security.JwtUtil;
import com.sharath.banking_management_system.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setMobile(request.getMobile());

        user.setRole("USER");

        user.setCreatedDate(LocalDateTime.now());

        userRepository.save(user);
    }

    @Override
    public JwtResponse login(LoginRequest request) {

        // 1. Authenticate email and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. Find the user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // 3. Get user's role
        String role = user.getRole();

        // 4. Generate JWT using email and role
        String token = jwtUtil.generateToken(
                user.getEmail(),
                role
        );

        // 5. Return JWT response
        return new JwtResponse(token);
    }
}