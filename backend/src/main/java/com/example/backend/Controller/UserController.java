package com.example.backend.Controller;

import com.example.backend.Entity.User;
import com.example.backend.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(toDto(user));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@AuthenticationPrincipal User user,
                                      @RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        Integer age = body.get("age") != null ? Integer.valueOf(body.get("age").toString()) : null;
        Double weight = body.get("weight") != null ? Double.valueOf(body.get("weight").toString()) : null;
        Double height = body.get("height") != null ? Double.valueOf(body.get("height").toString()) : null;
        String sex = (String) body.get("sex");
        String fitnessLevel = (String) body.get("fitnessLevel");
        String bio = (String) body.get("bio");
        String personalGoal = (String) body.get("personalGoal");

        User updated = userService.updateProfile(user.getId(), name, age, weight,
                height, sex, fitnessLevel, bio, personalGoal);
        return ResponseEntity.ok(toDto(updated));
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String q,
                                    @AuthenticationPrincipal User currentUser) {
        List<Map<String, Object>> results = userService.search(q)
                .stream()
                .filter(u -> !u.getId().equals(currentUser.getId()))
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }

    private Map<String, Object> toDto(User u) {
        return Map.of(
                "id", u.getId(),
                "name", u.getName(),
                "email", u.getEmail(),
                "age", u.getAge() != null ? u.getAge() : 0,
                "weight", u.getWeight() != null ? u.getWeight() : 0,
                "height", u.getHeight() != null ? u.getHeight() : 0,
                "fitnessLevel", u.getFitnessLevel() != null ? u.getFitnessLevel() : "Beginner",
                "bio", u.getBio() != null ? u.getBio() : "",
                "personalGoal", u.getPersonalGoal() != null ? u.getPersonalGoal() : ""
        );
    }
}
