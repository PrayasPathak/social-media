package com.example.social.response;

public record FollowResponse(
        Long id,
        Long followerId,
        Long followingId
) {
}
