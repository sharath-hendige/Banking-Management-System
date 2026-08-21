package com.sharath.banking_management_system.service.impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sharath.banking_management_system.dto.request.UserRequest;
import com.sharath.banking_management_system.dto.response.UserResponse;
import com.sharath.banking_management_system.entity.User;
import com.sharath.banking_management_system.exception.DuplicateEmailException;
import com.sharath.banking_management_system.exception.ResourceNotFoundException;
import com.sharath.banking_management_system.repository.UserRepository;
import com.sharath.banking_management_system.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse register(UserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setMobile(request.getMobile());

        // Default role
        user.setRole("USER");

        // Default status
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );

        return convertToResponse(user);
    }

    @Override
    public UserResponse activateUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );

        user.setStatus("ACTIVE");

        User updatedUser = userRepository.save(user);

        return convertToResponse(updatedUser);
    }

    @Override
    public UserResponse deactivateUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );

        user.setStatus("INACTIVE");

        User updatedUser = userRepository.save(user);

        return convertToResponse(updatedUser);
    }

    private UserResponse convertToResponse(User user) {

    UserResponse response = new UserResponse();

    response.setId(user.getId());
    response.setName(user.getName());
    response.setEmail(user.getEmail());
    response.setMobile(user.getMobile());
    response.setRole(user.getRole());
    response.setStatus(user.getStatus());

    return response;
    }
}