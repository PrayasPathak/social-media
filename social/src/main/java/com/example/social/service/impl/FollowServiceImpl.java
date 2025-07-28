package com.example.social.service.impl;

import com.example.social.entity.Follow;
import com.example.social.entity.User;
import com.example.social.exception.ActionNotAllowedException;
import com.example.social.exception.ResourceNotFoundException;
import com.example.social.repository.FollowRepository;
import com.example.social.repository.UserRepository;
import com.example.social.request.FollowRequest;
import com.example.social.response.FollowResponse;
import com.example.social.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    @Override
    public FollowResponse follow(FollowRequest request, Long userId) {
        User follower = userRepository.findById(userId)
                .orElseThrow(()-> new ResourceNotFoundException("User not found"));
        User following = userRepository.findById(request.getFollowId())
                .orElseThrow(()-> new ResourceNotFoundException("User not found"));

        if (follower.getId().equals(request.getFollowId())) {
            throw new ActionNotAllowedException("You cannot follow yourself");
        }

        Optional<Follow> existing =
                followRepository.findByFollowerAndFollowing(follower, following);

        if (existing.isPresent()) {
            return new FollowResponse(
                    existing.get().getId(),
                    follower.getId(),
                    following.getId()
            );
        }

        Follow newFollow = followRepository.save(
                Follow.builder()
                        .follower(follower).following(following)
                        .followedAt(Instant.now())
                        .build()
        );

        return new FollowResponse(newFollow.getId(),
                follower.getId(), following.getId());
    }


    @Override
    @Transactional
    public void unfollow(Long followingId, Long userId) {
        var follower = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        var following = userRepository.findById(followingId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        followRepository.findByFollowerAndFollowing(follower, following)
                .ifPresent(followRepository::delete);
    }

    @Override
    public List<FollowResponse> getFollowers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return followRepository.findByFollowing(user).stream()
                .map(f -> new FollowResponse(f.getId(), f.getFollower().getId(), f.getFollowing().getId()))
                .toList();
    }

    @Override
    public List<FollowResponse> getFollowings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return followRepository.findByFollower(user).stream()
                .map(f -> new FollowResponse(f.getId(), f.getFollower().getId(), f.getFollowing().getId()))
                .toList();
    }
}
