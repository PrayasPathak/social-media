package com.example.social.response;

import com.example.social.entity.Like;

public record LikeResponse(
        Long id,
        Long userId,
        Long postId,
        long likeCount
) {
    public static LikeResponse fromEntity(Like like, long likeCount) {
        return new LikeResponse(
                like.getId(),
                like.getUser().getId(),
                like.getPost().getId(),
                likeCount
        );
    }
}
