package com.univo.backend_app.controllers;

import com.univo.backend_app.models.TareaDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tareas")
public class TareaController {

    @GetMapping
    public List<TareaDTO> obtenerTareas() {
        return List.of(
                new TareaDTO("TH-142", "Rediseno Arquitectura Cloud", "En progreso", "Alex", "Urgente"),
                new TareaDTO("TH-143", "Migracion Base de Datos", "En revision", "Sara", "Alta"),
                new TareaDTO("TH-145", "Integracion API ERP", "Pendiente", "Alex", "Alta")
        );
    }

    @PostMapping
    public Map<String, Object> crearTarea(@RequestBody TareaDTO tareaRecibida) {
        return Map.of(
                "mensaje", "Tarea recibida correctamente",
                "tarea", tareaRecibida
        );
    }
}
