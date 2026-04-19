package com.example.backend.Repository;

import com.example.backend.Entity.Friendship;
import com.example.backend.Entity.Friendship.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT f FROM Friendship f WHERE (f.requester.id = :uid OR f.receiver.id = :uid) AND f.status = :status")
    List<Friendship> findByUserAndStatus(@Param("uid") Long userId, @Param("status") Status status);

    @Query("SELECT f FROM Friendship f WHERE (f.requester.id = :a AND f.receiver.id = :b) OR (f.requester.id = :b AND f.receiver.id = :a)")
    Optional<Friendship> findBetween(@Param("a") Long aId, @Param("b") Long bId);
}
