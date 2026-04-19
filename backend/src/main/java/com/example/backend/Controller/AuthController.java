package com.example.backend.Controller;

import com.example.backend.Entity.User;
import com.example.backend.Security.JwtUtil;
import com.example.backend.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        try {
            String name = (String) body.get("name");
            String email = (String) body.get("email");
            String password = (String) body.get("password");
            Integer age = body.get("age") != null ? Integer.valueOf(body.get("age").toString()) : null;
            Double weight = body.get("weight") != null ? Double.valueOf(body.get("weight").toString()) : null;
            Double height = body.get("height") != null ? Double.valueOf(body.get("height").toString()) : null;
            String sex = (String) body.get("sex");
            String level = (String) body.getOrDefault("level", "Beginner");

            User user = userService.register(name, email, password, age, weight, height, sex, level);
            String token = jwtUtil.generateToken(user.getId(), user.getEmail());
            return ResponseEntity.ok(Map.of("token", token, "user", toDto(user)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String password = body.get("password");
            User user = userService.findByEmail(email);
            if (!userService.checkPassword(user, password)) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
            }
            String token = jwtUtil.generateToken(user.getId(), user.getEmail());
            return ResponseEntity.ok(Map.of("token", token, "user", toDto(user)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }
    }

    private Map<String, Object> toDto(User u) {
        return Map.of(
                "id", u.getId(),
                "name", u.getName(),
                "email", u.getEmail(),
                "fitnessLevel", u.getFitnessLevel() != null ? u.getFitnessLevel() : "Beginner"
        );
    }
}
