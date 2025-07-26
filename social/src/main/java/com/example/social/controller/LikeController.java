package com.example.social.controller;

import com.example.social.entity.User;
import com.example.social.response.LikeResponse;
import com.example.social.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/likes")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;

    @PostMapping("/{postId}")
    public ResponseEntity<LikeResponse> like(
            @PathVariable Long postId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(likeService.like(postId, user.getId()));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> unlike(
            @PathVariable Long postId,
            @AuthenticationPrincipal User user) {
        likeService.unlike(postId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{postId}")
    public ResponseEntity<List<LikeResponse>> getLikes(@PathVariable Long postId) {
        return ResponseEntity.ok(likeService.getLikes(postId));
    }
}
