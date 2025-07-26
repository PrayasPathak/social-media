package com.example.social.service;

import com.example.social.request.BookmarkRequest;
import com.example.social.response.BookmarkResponse;

import java.util.List;

public interface BookmarkService {
    BookmarkResponse bookmarkPost(BookmarkRequest request, Long userId);

    void removeBookmark(Long postId, Long userId);

    List<BookmarkResponse> getUserBookmarks(Long userId);
}
