package com.example.backend.Controller;

import com.example.backend.Entity.Activity;
import com.example.backend.Entity.Friendship;
import com.example.backend.Entity.User;
import com.example.backend.Service.FriendService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    private final FriendService friendService;

    public FriendController(FriendService friendService) {
        this.friendService = friendService;
    }

    @GetMapping
    public ResponseEntity<?> list(@AuthenticationPrincipal User user) {
        List<Map<String, Object>> dtos = friendService.getFriendships(user.getId())
                .stream()
                .map(f -> friendshipDto(f, user.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<?> sendRequest(@PathVariable Long receiverId,
                                         @AuthenticationPrincipal User user) {
        try {
            Friendship f = friendService.sendRequest(user.getId(), receiverId);
            return ResponseEntity.ok(Map.of("message", "Request sent", "id", f.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/accept/{requesterId}")
    public ResponseEntity<?> accept(@PathVariable Long requesterId,
                                    @AuthenticationPrincipal User user) {
        Friendship f = friendService.accept(user.getId(), requesterId);
        return ResponseEntity.ok(Map.of("message", "Accepted", "status", f.getStatus()));
    }

    @DeleteMapping("/decline/{otherId}")
    public ResponseEntity<?> decline(@PathVariable Long otherId,
                                     @AuthenticationPrincipal User user) {
        friendService.decline(user.getId(), otherId);
        return ResponseEntity.ok(Map.of("message", "Declined"));
    }

    @GetMapping("/feed")
    public ResponseEntity<?> feed(@AuthenticationPrincipal User user) {
        List<Map<String, Object>> activities = friendService.getFriendFeed(user.getId())
                .stream()
                .map(a -> Map.<String, Object>of(
                        "id", a.getId(),
                        "userId", a.getUser().getId(),
                        "userName", a.getUser().getName(),
                        "type", a.getType(),
                        "date", a.getDate(),
                        "duration", a.getDuration() != null ? a.getDuration() : 0,
                        "distance", a.getDistance() != null ? a.getDistance() : 0.0,
                        "calories", a.getCalories() != null ? a.getCalories() : 0,
                        "notes", a.getNotes() != null ? a.getNotes() : ""
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(activities);
    }

    private Map<String, Object> friendshipDto(Friendship f, Long currentUserId) {
        // Identify the "other" user from current user's perspective
        User other = f.getRequester().getId().equals(currentUserId)
                ? f.getReceiver() : f.getRequester();
        return Map.of(
                "id", other.getId(),
                "name", other.getName(),
                "fitnessLevel", other.getFitnessLevel() != null ? other.getFitnessLevel() : "Beginner",
                "status", f.getStatus().name().toLowerCase()
        );
    }
}
