package com.example.social.service.impl;

import com.example.social.entity.Role;
import com.example.social.entity.User;
import com.example.social.exception.ActionNotAllowedException;
import com.example.social.exception.ResourceNotFoundException;
import com.example.social.repository.UserRepository;
import com.example.social.request.UpdateUserRequest;
import com.example.social.response.UserResponse;
import com.example.social.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    @Override
    public UserResponse updateUser(Long requesterId, Long id, UpdateUserRequest request) {
        if (!requesterId.equals(id)) {
            throw new ActionNotAllowedException("You are not allowed to update another user's profile.");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setFullName(request.getFullName());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> searchUser(String query) {
        return userRepository.findByFullNameContainingIgnoreCase(query)
                .stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    private UserResponse mapToUserResponse(User user) {
        var roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                roles
        );
    }
}
