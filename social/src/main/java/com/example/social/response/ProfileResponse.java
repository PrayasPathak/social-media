package com.example.social.response;

import com.example.social.entity.Profile;
import lombok.Builder;

@Builder
public record ProfileResponse(
        Long id,
        String bio,
        String profilePicture,
        Long userId
) {
    public static ProfileResponse fromEntity(Profile profile) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .bio(profile.getBio())
                .profilePicture(profile.getProfilePicture())
                .userId(profile.getUser().getId())
                .build();
    }
}
