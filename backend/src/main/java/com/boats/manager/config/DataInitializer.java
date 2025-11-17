package com.boats.manager.config;

import com.boats.manager.model.AppUser;
import com.boats.manager.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByUsername("test").isEmpty()) {
                AppUser appUser = new AppUser();
                appUser.setUsername("test");
                appUser.setPassword(new BCryptPasswordEncoder().encode("test"));
                userRepository.save(appUser);
            }
        };
    }

}
