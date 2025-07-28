package com.example.social.service.impl;

import com.example.social.entity.Profile;
import com.example.social.exception.ResourceNotFoundException;
import com.example.social.exception.UnauthorizedActionException;
import com.example.social.repository.ProfileRepository;
import com.example.social.repository.UserRepository;
import com.example.social.request.UpdateProfileRequest;
import com.example.social.response.ProfileResponse;
import com.example.social.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    private final String uploadDir = "uploads/profile_pictures/";


    @Override
    public ProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user"));

        if (!profile.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You can only update your own profile.");
        }

        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }

        MultipartFile image = request.getImage();
        if (image != null && !image.isEmpty()) {
            String fileName = StringUtils.cleanPath(UUID.randomUUID() + "_" + image.getOriginalFilename());
            try {
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                image.transferTo(filePath);
                profile.setProfilePicture("/" + uploadDir + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to store image file", e);
            }
        }
        profileRepository.save(profile);
        return ProfileResponse.fromEntity(profile);
    }

    @Override
    @Transactional
    public void deleteProfile(Long userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user"));

        if (!profile.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You can only delete your own profile.");
        }
        var user = profile.getUser();
        user.setProfile(null);
        userRepository.save(user);
        profileRepository.delete(profile);
    }

    @Override
    public ProfileResponse getCurrentProfile(Long reqUserId) {
        Profile profile = profileRepository.findByUserId(reqUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user"));

        return ProfileResponse.fromEntity(profile);
    }

    @Override
    public ProfileResponse getProfileByUserId(Long userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user"));
        return ProfileResponse.fromEntity(profile);
    }
}
