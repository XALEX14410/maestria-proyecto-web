package com.univo.backend_app.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

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
                "status", "UP",
                "service", "TaskHive API"
        );
    }
}
