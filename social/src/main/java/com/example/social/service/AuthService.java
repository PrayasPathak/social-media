package com.example.social.service;

import com.example.social.response.AuthenticationResponse;
import com.example.social.request.LoginRequest;
import com.example.social.request.RegistrationRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface AuthService {
    AuthenticationResponse registerUser(RegistrationRequest request);

    AuthenticationResponse login(LoginRequest request);

    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;
}
