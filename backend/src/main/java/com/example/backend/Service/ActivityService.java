package com.example.backend.Service;

import com.example.backend.Entity.Activity;
import com.example.backend.Entity.User;
import com.example.backend.Repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserService userService;

    public ActivityService(ActivityRepository activityRepository, UserService userService) {
        this.activityRepository = activityRepository;
        this.userService = userService;
    }

    public List<Activity> getActivitiesForUser(Long userId) {
        return activityRepository.findByUserIdOrderByDateDesc(userId);
    }

    public Activity create(Long userId, String type, String date,
                           Integer duration, Double distance,
                           Integer calories, String weather, String notes) {
        User user = userService.findById(userId);
        Activity a = new Activity();
        a.setUser(user);
        a.setType(type);
        a.setDate(date);
        a.setDuration(duration);
        a.setDistance(distance);
        a.setCalories(calories);
        a.setWeather(weather);
        a.setNotes(notes);
        return activityRepository.save(a);
    }

    public void delete(Long activityId, Long userId) {
        Activity a = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        if (!a.getUser().getId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }
        activityRepository.delete(a);
    }

    public Activity findById(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
    }

    public List<Activity> getFeedForUser(Long userId) {
        // get friend IDs then their activities
        // This is called from FriendService to avoid circular deps
        return activityRepository.findByUserIdInOrderByDateDesc(List.of(userId));
    }

    public List<Activity> getFeedForFriendIds(List<Long> friendIds) {
        if (friendIds.isEmpty()) return List.of();
        return activityRepository.findByUserIdInOrderByDateDesc(friendIds);
    }
}
