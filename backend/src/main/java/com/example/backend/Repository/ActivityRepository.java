package com.example.backend.Repository;

import com.example.backend.Entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUserIdOrderByDateDesc(Long userId);
    List<Activity> findByUserIdInOrderByDateDesc(List<Long> userIds);
}
