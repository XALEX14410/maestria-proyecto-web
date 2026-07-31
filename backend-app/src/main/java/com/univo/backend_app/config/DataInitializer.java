package com.univo.backend_app.config;

import com.univo.backend_app.models.Usuario;
import com.univo.backend_app.repositories.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedDemoUser(UsuarioRepository usuarioRepository) {
        return args -> {
            String email = "demo@taskhive.com";

            if (!usuarioRepository.existsByEmail(email)) {
                usuarioRepository.save(new Usuario("Usuario Demo", email, "demo123"));
            }
        };
    }
}
