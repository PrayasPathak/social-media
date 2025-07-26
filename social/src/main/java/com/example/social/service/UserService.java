package com.example.social.service;

import com.example.social.request.UpdateUserRequest;
import com.example.social.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse getUserById(Long id);

    UserResponse updateUser(Long requesterId, Long id, UpdateUserRequest request);

    List<UserResponse> getAllUsers();
}
