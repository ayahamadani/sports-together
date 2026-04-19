package com.example.backend.Service;

import com.example.backend.Entity.User;
import com.example.backend.Repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String name, String email, String rawPassword,
                         Integer age, Double weight, Double height,
                         String sex, String fitnessLevel) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already in use");
        }
        User u = new User(name, email, passwordEncoder.encode(rawPassword));
        u.setAge(age);
        u.setWeight(weight);
        u.setHeight(height);
        u.setSex(sex);
        if (fitnessLevel != null) u.setFitnessLevel(fitnessLevel);
        return userRepository.save(u);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    public User updateProfile(Long userId, String name, Integer age, Double weight,
                              Double height, String sex, String fitnessLevel,
                              String bio, String personalGoal) {
        User u = findById(userId);
        if (name != null) u.setName(name);
        if (age != null) u.setAge(age);
        if (weight != null) u.setWeight(weight);
        if (height != null) u.setHeight(height);
        if (sex != null) u.setSex(sex);
        if (fitnessLevel != null) u.setFitnessLevel(fitnessLevel);
        if (bio != null) u.setBio(bio);
        if (personalGoal != null) u.setPersonalGoal(personalGoal);
        return userRepository.save(u);
    }

    public List<User> search(String query) {
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }
}
