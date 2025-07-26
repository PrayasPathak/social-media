package com.example.social.service;

import com.example.social.response.LikeResponse;

import java.util.List;

public interface LikeService {
    LikeResponse like(long postId, long userId);

    void unlike(long postId, long userId);

    List<LikeResponse> getLikes(Long postId);
}
