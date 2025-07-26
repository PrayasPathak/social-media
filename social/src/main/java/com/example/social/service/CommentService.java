package com.example.social.service;

import com.example.social.request.CommentRequest;
import com.example.social.response.CommentResponse;

import java.util.List;

public interface CommentService {
    CommentResponse createComment(Long postId, Long userId, CommentRequest request);

    List<CommentResponse> getByPost(Long postId);

    void delete(Long commentId, Long userId);

    CommentResponse updateComment(Long commentId, Long userId, CommentRequest request);
}
