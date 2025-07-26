package com.example.social.controller;

import com.example.social.entity.User;
import com.example.social.request.FollowRequest;
import com.example.social.response.FollowResponse;
import com.example.social.service.FollowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/follow")
@RequiredArgsConstructor
public class FollowController {
    private final FollowService followService;

    @PostMapping
    public ResponseEntity<FollowResponse> follow(
            @Valid @RequestBody FollowRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(followService.follow(request, user.getId()));
    }

    @DeleteMapping("/{followingId}")
    public ResponseEntity<Void> unfollow(
            @PathVariable Long followingId,
            @AuthenticationPrincipal User user) {
        followService.unfollow(followingId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<FollowResponse>> getFollowers(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowers(userId));
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<List<FollowResponse>> getFollowing(@PathVariable Long userId) {
        return ResponseEntity.ok(followService.getFollowings(userId));
    }
}
