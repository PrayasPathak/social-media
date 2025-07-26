package com.example.social.service.impl;

import com.example.social.entity.Post;
import com.example.social.entity.User;
import com.example.social.exception.ResourceNotFoundException;
import com.example.social.exception.UnauthorizedActionException;
import com.example.social.repository.PostRepository;
import com.example.social.repository.UserRepository;
import com.example.social.request.CreatePostRequest;
import com.example.social.request.UpdatePostRequest;
import com.example.social.response.PostResponse;
import com.example.social.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final String UPLOAD_DIR = "uploads/posts";

    @Override
    public PostResponse createPost(Long userId, CreatePostRequest request) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String mediaPath = null;
        if (request.getMedia() != null && !request.getMedia().isEmpty()) {
            mediaPath = saveMediaFile(request.getMedia());
        }
        Post post = Post.builder()
                .caption(request.getCaption())
                .mediaUrl(mediaPath)
                .user(user)
                .build();

        postRepository.save(post);
        return PostResponse.fromEntity(post);
    }

    @Override
    public PostResponse updatePost(Long postId, UpdatePostRequest request, Long userId) throws IOException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You cannot update this post");
        }

        if (request.getCaption() != null) {
            post.setCaption(request.getCaption());
        }

        if (request.getMedia() != null && !request.getMedia().isEmpty()) {
            String newPath = saveMediaFile(request.getMedia());
            post.setMediaUrl(newPath);
        }

        postRepository.save(post);
        return PostResponse.fromEntity(post);
    }

    @Override
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        if (!post.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You cannot delete this post");
        }
        postRepository.delete(post);
    }

    @Override
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(PostResponse::fromEntity)
                .toList();
    }

    @Override
    public PostResponse getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return PostResponse.fromEntity(post);
    }

    private String saveMediaFile(MultipartFile file) throws IOException {
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filepath = Path.of(UPLOAD_DIR, filename);
        Files.write(filepath, file.getBytes());
        return "/uploads/posts/" + filename;
    }
}
