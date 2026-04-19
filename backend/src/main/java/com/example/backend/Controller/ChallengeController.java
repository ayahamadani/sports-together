package com.example.backend.Controller;

import com.example.backend.Entity.Challenge;
import com.example.backend.Entity.ChallengeParticipant;
import com.example.backend.Entity.User;
import com.example.backend.Service.ChallengeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @GetMapping
    public ResponseEntity<?> list(@AuthenticationPrincipal User user) {
        List<Map<String, Object>> dtos = challengeService.getAll()
                .stream()
                .map(c -> toDto(c, user.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal User user,
                                    @RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        String type = (String) body.get("type");
        String metric = (String) body.get("metric");
        Double goal = body.get("goal") != null ? Double.valueOf(body.get("goal").toString()) : null;
        String unit = (String) body.get("unit");
        String endDate = (String) body.get("endDate");

        Challenge c = challengeService.create(user.getId(), title, type, metric, goal, unit, endDate);
        return ResponseEntity.ok(toDto(c, user.getId()));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> join(@PathVariable Long id,
                                  @AuthenticationPrincipal User user) {
        try {
            challengeService.join(id, user.getId());
            return ResponseEntity.ok(Map.of("message", "Joined"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/leaderboard")
    public ResponseEntity<?> leaderboard(@PathVariable Long id) {
        AtomicInteger rank = new AtomicInteger(1);
        List<Map<String, Object>> board = challengeService.getLeaderboard(id)
                .stream()
                .map(p -> Map.<String, Object>of(
                        "rank", rank.getAndIncrement(),
                        "userId", p.getUser().getId(),
                        "name", p.getUser().getName(),
                        "avatar", p.getUser().getName().substring(0, Math.min(2, p.getUser().getName().length())).toUpperCase(),
                        "value", p.getProgress()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(board);
    }

    private Map<String, Object> toDto(Challenge c, Long currentUserId) {
        boolean joined = challengeService.isJoined(c.getId(), currentUserId);
        double current = challengeService.getProgress(c.getId(), currentUserId);
        return Map.of(
                "id", c.getId(),
                "title", c.getTitle(),
                "type", c.getType() != null ? c.getType() : "Other",
                "metric", c.getMetric() != null ? c.getMetric() : "distance",
                "goal", c.getGoal() != null ? c.getGoal() : 0,
                "unit", c.getUnit() != null ? c.getUnit() : "km",
                "endDate", c.getEndDate() != null ? c.getEndDate() : "",
                "participants", c.getParticipants().size(),
                "joined", joined,
                "current", current
        );
    }
}
