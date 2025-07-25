package com.example.social.service;

import com.example.social.response.AuthenticationResponse;
import com.example.social.request.LoginRequest;
import com.example.social.request.RegistrationRequest;

public interface AuthService {
    AuthenticationResponse registerUser(RegistrationRequest request);

    AuthenticationResponse login(LoginRequest request);
}
