package com.example.social.service.impl;

import com.example.social.entity.Like;
import com.example.social.entity.Post;
import com.example.social.entity.User;
import com.example.social.exception.ActionNotAllowedException;
import com.example.social.exception.ResourceNotFoundException;
import com.example.social.repository.LikeRepository;
import com.example.social.repository.PostRepository;
import com.example.social.repository.UserRepository;
import com.example.social.response.LikeResponse;
import com.example.social.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {
        private final LikeRepository likeRepository;
        private final PostRepository postRepository;
        private final UserRepository userRepository;

        @Override
        public LikeResponse like(long postId, long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                Post post = postRepository.findById(postId)
                                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

                Like existingLike = likeRepository.findByUserAndPost(user, post).orElse(null);

                if (existingLike != null) {
                        long likeCount = likeRepository.countByPost(post);
                        return LikeResponse.fromEntity(existingLike, likeCount);
                }

                Like newLike = Like.builder()
                                .user(user)
                                .post(post)
                                .build();

                likeRepository.save(newLike);
                long likeCount = likeRepository.countByPost(post);
                return LikeResponse.fromEntity(newLike, likeCount);
        }

        @Override
        @Transactional
        public void unlike(long postId, long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                Post post = postRepository.findById(postId)
                                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

                likeRepository.findByUserAndPost(user, post).ifPresent(likeRepository::delete);
        }

        @Override
        public List<LikeResponse> getLikes(Long postId) {
                Post post = postRepository.findById(postId)
                                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

                List<Like> likes = likeRepository.findByPost(post);
                long likeCount = likes.size();

                return likes.stream()
                                .map(like -> LikeResponse.fromEntity(like, likeCount))
                                .toList();
        }
}
