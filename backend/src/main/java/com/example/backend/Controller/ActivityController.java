package com.example.backend.Controller;

import com.example.backend.Entity.Activity;
import com.example.backend.Entity.User;
import com.example.backend.Service.ActivityService;
import com.example.backend.Service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;
    private final CommentService commentService;

    public ActivityController(ActivityService activityService, CommentService commentService) {
        this.activityService = activityService;
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<?> list(@AuthenticationPrincipal User user) {
        List<Map<String, Object>> dtos = activityService.getActivitiesForUser(user.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal User user,
                                    @RequestBody Map<String, Object> body) {
        String type = (String) body.get("type");
        String date = (String) body.get("date");
        Integer duration = body.get("duration") != null ? Integer.valueOf(body.get("duration").toString()) : null;
        Double distance = body.get("distance") != null ? Double.valueOf(body.get("distance").toString()) : null;
        Integer calories = body.get("calories") != null ? Integer.valueOf(body.get("calories").toString()) : null;
        String weather = (String) body.getOrDefault("weather", "N/A");
        String notes = (String) body.getOrDefault("notes", "");

        Activity a = activityService.create(user.getId(), type, date, duration, distance, calories, weather, notes);
        return ResponseEntity.ok(toDto(a));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                    @AuthenticationPrincipal User user) {
        activityService.delete(id, user.getId());
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    // Comments
    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(
                commentService.getComments(id).stream().map(c -> Map.of(
                        "id", c.getId(),
                        "authorName", c.getAuthor().getName(),
                        "text", c.getText(),
                        "createdAt", c.getCreatedAt().toString()
                )).collect(Collectors.toList())
        );
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id,
                                        @AuthenticationPrincipal User user,
                                        @RequestBody Map<String, String> body) {
        var comment = commentService.addComment(id, user.getId(), body.get("text"));
        return ResponseEntity.ok(Map.of(
                "id", comment.getId(),
                "authorName", comment.getAuthor().getName(),
                "text", comment.getText(),
                "createdAt", comment.getCreatedAt().toString()
        ));
    }

    // Reactions
    @PostMapping("/{id}/reactions")
    public ResponseEntity<?> addReaction(@PathVariable Long id,
                                         @AuthenticationPrincipal User user,
                                         @RequestBody Map<String, String> body) {
        commentService.addReaction(id, user.getId(), body.get("type"));
        return ResponseEntity.ok(commentService.getReactionCounts(id));
    }

    @GetMapping("/{id}/reactions")
    public ResponseEntity<?> getReactions(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getReactionCounts(id));
    }

    private Map<String, Object> toDto(Activity a) {
        return Map.of(
                "id", a.getId(),
                "type", a.getType(),
                "date", a.getDate(),
                "duration", a.getDuration() != null ? a.getDuration() : 0,
                "distance", a.getDistance() != null ? a.getDistance() : 0.0,
                "calories", a.getCalories() != null ? a.getCalories() : 0,
                "weather", a.getWeather() != null ? a.getWeather() : "N/A",
                "notes", a.getNotes() != null ? a.getNotes() : ""
        );
    }
}
