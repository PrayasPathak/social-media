package com.example.social.service;

import com.example.social.request.UpdateProfileRequest;
import com.example.social.response.ProfileResponse;

public interface ProfileService {
    ProfileResponse updateProfile(Long userId, UpdateProfileRequest request);

    void deleteProfile(Long userId);

    ProfileResponse getProfileByUserId(Long userId);
}
