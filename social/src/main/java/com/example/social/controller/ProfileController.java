package com.example.social.controller;

import com.example.social.entity.User;
import com.example.social.request.UpdateProfileRequest;
import com.example.social.response.ProfileResponse;
import com.example.social.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @PutMapping(value = "/me", consumes = "multipart/form-data")
    public ResponseEntity<ProfileResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @ModelAttribute UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(profileService.updateProfile(user.getId(), request));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteProfile(@AuthenticationPrincipal User user) {
        profileService.deleteProfile(user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(profileService.getCurrentProfile(user.getId()));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ProfileResponse> getUserProfile(@PathVariable Long userId){
        return ResponseEntity.ok(profileService.getProfileByUserId(userId));
    }
}
