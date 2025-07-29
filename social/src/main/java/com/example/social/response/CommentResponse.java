package com.example.social.response;

import com.example.social.entity.Comment;

import java.time.Instant;

public record CommentResponse(
        Long id,
        String content,
        UserComment user,
        Long postId,
        Instant createdAt
) {
    public static CommentResponse fromEntity(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getText(),
                UserComment.builder()
                        .id(comment.getUser().getId())
                        .fullName(comment.getUser().getFullName())
                        .profilePicture(comment.getUser().getProfile().getProfilePicture())
                        .build(),
                comment.getPost().getId(),
                comment.getCreatedAt()
        );
    }
}
