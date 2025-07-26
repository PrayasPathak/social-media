package com.example.social.controller;

import com.example.social.entity.User;
import com.example.social.repository.PostRepository;
import com.example.social.request.CreatePostRequest;
import com.example.social.request.UpdatePostRequest;
import com.example.social.response.PostResponse;
import com.example.social.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @AuthenticationPrincipal User user,
            @ModelAttribute CreatePostRequest request
    ) throws IOException {
        return ResponseEntity.ok(postService.createPost(user.getId(), request));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long postId,
            @ModelAttribute UpdatePostRequest request,
            @AuthenticationPrincipal User user
    ) throws IOException {
        return ResponseEntity.ok(postService.updatePost(postId, request, user.getId()));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId, @AuthenticationPrincipal User user) {
        postService.deletePost(postId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostById(postId));
    }
}
