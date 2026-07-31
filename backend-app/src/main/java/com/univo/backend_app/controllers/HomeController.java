package com.univo.backend_app.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return status();
    }

    @GetMapping("/api/v1/status")
    public Map<String, Object> status() {
        return Map.of(
                "application", "backend-app",
                "status", "UP",
                "timestamp", OffsetDateTime.now().toString(),
                "endpoints", List.of(
                        "/api/v1/status",
                        "/api/v1/auth/login",
                        "/api/v1/tareas",
                        "/api/v1/mensajes",
                        "/api/v1/ia/consulta?pregunta=Hola",
                        "/api/ai/analizar-tarea"
                )
        );
    }
}
