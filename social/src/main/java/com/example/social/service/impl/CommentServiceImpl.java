package com.example.social.service.impl;

import com.example.social.entity.Comment;
import com.example.social.entity.Post;
import com.example.social.entity.User;
import com.example.social.exception.ResourceNotFoundException;
import com.example.social.exception.UnauthorizedActionException;
import com.example.social.repository.CommentRepository;
import com.example.social.repository.PostRepository;
import com.example.social.repository.UserRepository;
import com.example.social.request.CommentRequest;
import com.example.social.response.CommentResponse;
import com.example.social.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    public CommentResponse createComment(Long postId, Long userId, CommentRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = Comment.builder()
                .text(request.getText())
                .user(user)
                .post(post)
                .createdAt(Instant.now())
                .build();
        return CommentResponse.fromEntity(commentRepository.save(comment));
    }

    @Override
    public List<CommentResponse> getByPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        return commentRepository.findByPost(post).stream()
                .map(CommentResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public void delete(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        if (!comment.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You cannot delete this comment");
        }
        commentRepository.delete(comment);
    }

    @Override
    public CommentResponse updateComment(Long commentId, Long userId, CommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        if (!comment.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You cannot update this comment");
        }
        comment.setText(request.getText());
        return CommentResponse.fromEntity(commentRepository.save(comment));
    }
}
