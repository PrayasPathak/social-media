package com.example.social.response;

import com.example.social.entity.Comment;

import java.time.Instant;

public record CommentResponse(
        Long id,
        String content,
        Long userId,
        Long postId,
        Instant createdAt
) {
    public static CommentResponse fromEntity(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getText(),
                comment.getUser().getId(),
                comment.getPost().getId(),
                comment.getCreatedAt()
        );
    }
}
