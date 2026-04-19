package com.example.backend.Repository;

import com.example.backend.Entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    List<Reaction> findByActivityId(Long activityId);
    Optional<Reaction> findByActivityIdAndUserIdAndType(Long activityId, Long userId, String type);

    @Query("SELECT r.type, COUNT(r) FROM Reaction r WHERE r.activity.id = :actId GROUP BY r.type")
    List<Object[]> countByTypeForActivity(@Param("actId") Long activityId);
}
