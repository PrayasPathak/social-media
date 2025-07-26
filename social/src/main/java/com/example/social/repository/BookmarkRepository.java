package com.example.social.repository;

import com.example.social.entity.Bookmark;
import com.example.social.entity.Post;
import com.example.social.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByUserAndPost(User user, Post post);

    boolean existsByUserAndPost(User user, Post post);

    List<Bookmark> findByUser(User user);

    void deleteByUserAndPost(User user, Post post);
}
