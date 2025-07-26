package com.example.social.service;

import com.example.social.request.FollowRequest;
import com.example.social.response.FollowResponse;

import java.util.List;

public interface FollowService {
    FollowResponse follow(FollowRequest request, Long userId);

    void unfollow(Long followingId, Long userId);

    List<FollowResponse> getFollowers(Long userId);

    List<FollowResponse> getFollowings(Long userId);
}
