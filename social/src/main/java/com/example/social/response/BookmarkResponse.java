package com.example.social.response;

public record BookmarkResponse(
        Long id,
        Long userId,
        Long postId
) {
}
