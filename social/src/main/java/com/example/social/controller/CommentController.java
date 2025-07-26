package com.example.social.controller;

import com.example.social.entity.User;
import com.example.social.request.CommentRequest;
import com.example.social.response.CommentResponse;
import com.example.social.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/{postId}")
    public ResponseEntity<CommentResponse> create(
            @PathVariable Long postId,
            @RequestBody CommentRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(commentService.createComment(postId, user.getId(), request));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponse>> getByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getByPost(postId));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> update(
            @PathVariable Long commentId,
            @RequestBody CommentRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(commentService.updateComment(commentId, user.getId(), request));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long commentId,
            @AuthenticationPrincipal User user) {
        commentService.delete(commentId, user.getId());
        return ResponseEntity.noContent().build();
    }
}
