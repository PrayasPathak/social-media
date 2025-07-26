package com.example.social.service.impl;

import com.example.social.entity.Token;
import com.example.social.repository.TokenRepository;
import com.example.social.response.AuthenticationResponse;
import com.example.social.entity.User;
import com.example.social.exception.ActionNotAllowedException;
import com.example.social.exception.ResourceNotFoundException;
import com.example.social.repository.RoleRepository;
import com.example.social.repository.UserRepository;
import com.example.social.request.LoginRequest;
import com.example.social.request.RegistrationRequest;
import com.example.social.security.JwtService;
import com.example.social.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;
    private final TokenRepository tokenRepository;

    @Override
    public AuthenticationResponse registerUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new ActionNotAllowedException("Email already in use");
        var roles = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        var user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(roles))
                .build();

        var savedUser = userRepository.save(user);
        var claims = new HashMap<String, Object>();
        claims.put("fullName", user.getFullName());
        var jwtToken = jwtService.generateToken(claims, user);
        saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .status(true)
                .build();
    }

    @Override
    public AuthenticationResponse login(LoginRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                ));
        var claims = new HashMap<String, Object>();
        var user = (User) auth.getPrincipal();
        claims.put("fullName", user.getFullName());
        var jwtToken = jwtService.generateToken(claims, user);
        revokeAllTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .status(true)
                .build();
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllTokens(User user){
        var validTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if(validTokens.isEmpty())
            return;
        validTokens.forEach(t -> {
            t.setRevoked(true);
            t.setExpired(true);
        });
        tokenRepository.saveAll(validTokens);
    }
}
