package com.example.social.response;

import com.example.social.entity.Post;

public record PostResponse(
        Long id,
        String caption,
        String mediaUrl,
        Long userId
) {
    public static PostResponse fromEntity(Post post) {
        return new PostResponse(
                post.getId(),
                post.getCaption(),
                post.getMediaUrl(),
                post.getUser().getId()
        );
    }
}
