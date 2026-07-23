package com.univo.backend_app.controllers;

import com.univo.backend_app.services.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analizar-tarea")
    public ResponseEntity<Map<String, String>> analizarTarea(@RequestBody Map<String, String> request) {
        String texto = request.get("texto");
        if (texto == null || texto.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El campo 'texto' es requerido."));
        }

        String prioridad = aiService.analizarPrioridadTarea(texto);
        return ResponseEntity.ok(Map.of(
                "prioridad_detectada", prioridad,
                "texto_original", texto
        ));
    }
}
