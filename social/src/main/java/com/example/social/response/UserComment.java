package com.example.social.response;

import lombok.Builder;

@Builder
public record UserComment(
        Long id,
        String fullName,
        String profilePicture
) {
}
