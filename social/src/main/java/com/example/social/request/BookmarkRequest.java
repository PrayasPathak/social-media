package com.example.social.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class BookmarkRequest {
    @NotNull(message = "Post id is required")
    Long postId;
}
