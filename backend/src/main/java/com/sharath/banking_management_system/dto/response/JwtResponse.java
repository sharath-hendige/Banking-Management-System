package com.sharath.banking_management_system.dto.response;

public class JwtResponse {

    private String token;
    private String role;
    public JwtResponse() {
    }

    public JwtResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}