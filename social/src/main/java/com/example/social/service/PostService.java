package com.example.social.service;

import com.example.social.request.CreatePostRequest;
import com.example.social.request.UpdatePostRequest;
import com.example.social.response.PostResponse;

import java.io.IOException;
import java.util.List;

public interface PostService {
    PostResponse createPost(Long userId, CreatePostRequest request) throws IOException;

    PostResponse updatePost(Long postId, UpdatePostRequest request, Long userId) throws IOException;

    void deletePost(Long postId, Long userId);

    List<PostResponse> getAllPosts();

    PostResponse getPostById(Long postId);
}
