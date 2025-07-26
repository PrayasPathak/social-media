package com.example.social.repository;

import com.example.social.entity.Like;
import com.example.social.entity.Post;
import com.example.social.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    boolean existsByUserIdAndPostId(Long userId, Long postId);

    long countByPostId(Long postId);

    Optional<Like> findByUserAndPost(User user, Post post);

    List<Like> findByPost(Post post);

}
