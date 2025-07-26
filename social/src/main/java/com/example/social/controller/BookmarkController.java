package com.example.social.controller;

import com.example.social.entity.User;
import com.example.social.request.BookmarkRequest;
import com.example.social.response.BookmarkResponse;
import com.example.social.service.BookmarkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {
    private final BookmarkService bookmarkService;

    @PostMapping
    public ResponseEntity<BookmarkResponse> bookmarkPost(
            @Valid @RequestBody BookmarkRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookmarkService.bookmarkPost(request, user.getId()));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> removeBookmark(
            @PathVariable Long postId,
            @AuthenticationPrincipal User user
    ) {
        bookmarkService.removeBookmark(postId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<BookmarkResponse>> getUserBookmarks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookmarkService.getUserBookmarks(user.getId()));
    }
}
