package com.univo.backend_app.config;

import com.univo.backend_app.models.Usuario;
import com.univo.backend_app.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedDemoUser(
            UsuarioRepository usuarioRepository,
            @Value("${app.demo-user.enabled}") boolean demoUserEnabled,
            @Value("${app.demo-user.name}") String demoUserName,
            @Value("${app.demo-user.email}") String demoUserEmail,
            @Value("${app.demo-user.password}") String demoUserPassword
    ) {
        return args -> {
            if (!demoUserEnabled) {
                return;
            }

            if (demoUserEmail.isBlank() || demoUserPassword.isBlank()) {
                throw new IllegalStateException("APP_DEMO_USER_EMAIL and APP_DEMO_USER_PASSWORD are required when APP_DEMO_USER_ENABLED=true.");
            }

            String email = demoUserEmail.trim().toLowerCase();
            if (!usuarioRepository.existsByEmail(email)) {
                usuarioRepository.save(new Usuario(demoUserName, email, demoUserPassword));
            }
        };
    }
}
