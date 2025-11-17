package com.boats.manager.web;

import com.boats.manager.repository.UserRepository;
import com.boats.manager.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        return userRepository.findByUsername(username)
                .map(user -> {
                    if (new BCryptPasswordEncoder().matches(password, user.getPassword())) {
                        String token = jwtUtil.generateToken(username);
                        return ResponseEntity.ok(Map.of("token", token));
                    } else {
                        return ResponseEntity.status(401).body("Invalid credentials");
                    }
                })
                .orElse(ResponseEntity.status(401).body("Invalid credentials"));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        try {
            final String authorizationHeader = request.getHeader("Authorization");

            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }

            final String token = authorizationHeader.substring(7); // Remove "Bearer " prefix

            if (jwtUtil.isTokenValid(token)) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(401).body("Invalid or expired token");
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token: " + e.getMessage());
        }
    }

}