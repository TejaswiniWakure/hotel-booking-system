package com.hotel.controller;

import com.hotel.entity.User;
import com.hotel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        user.setRole("USER");
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Mock Admin login for demo purposes
        if ("admin@luxestay.com".equals(email) && "admin".equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("token", "mock-jwt-token-admin");
            User adminUser = new User();
            adminUser.setId(0L);
            adminUser.setEmail(email);
            adminUser.setName("Admin User");
            adminUser.setRole("ADMIN");
            response.put("user", adminUser);
            return ResponseEntity.ok(response);
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("token", "mock-jwt-token-user-" + userOpt.get().getId());
            response.put("user", userOpt.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
