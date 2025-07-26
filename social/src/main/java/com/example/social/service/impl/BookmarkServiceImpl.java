package com.example.social.service.impl;

import com.example.social.entity.Bookmark;
import com.example.social.exception.ActionNotAllowedException;
import com.example.social.exception.ResourceNotFoundException;
import com.example.social.repository.BookmarkRepository;
import com.example.social.repository.PostRepository;
import com.example.social.repository.UserRepository;
import com.example.social.request.BookmarkRequest;
import com.example.social.response.BookmarkResponse;
import com.example.social.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {
    private final BookmarkRepository bookmarkRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    public BookmarkResponse bookmarkPost(BookmarkRequest request, Long userId) {
        var post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (bookmarkRepository.existsByUserAndPost(user, post))
            throw new ActionNotAllowedException("Post is already bookmarked");
        Bookmark bookmark = Bookmark.builder()
                .post(post)
                .user(user)
                .build();
        bookmark = bookmarkRepository.save(bookmark);
        return new BookmarkResponse(bookmark.getId(), user.getId(), post.getId());
    }

    @Override
    @Transactional
    public void removeBookmark(Long postId, Long userId) {
        var post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        bookmarkRepository.deleteByUserAndPost(user, post);
    }

    @Override
    public List<BookmarkResponse> getUserBookmarks(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookmarkRepository.findByUser(user).stream()
                .map(b -> new BookmarkResponse(b.getId(), b.getUser().getId(), b.getPost().getId()))
                .toList();
    }
}
