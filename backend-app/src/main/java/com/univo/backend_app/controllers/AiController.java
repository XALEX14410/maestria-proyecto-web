package com.univo.backend_app.controllers;

import com.univo.backend_app.models.TareaDTO;
import com.univo.backend_app.repositories.TaskRepository;
import com.univo.backend_app.services.InteligenciaArtificialService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ia")
public class AiController {
    private final InteligenciaArtificialService iaService;
    private final TaskRepository taskRepository;

    public AiController(InteligenciaArtificialService iaService, TaskRepository taskRepository) {
        this.iaService = iaService;
        this.taskRepository = taskRepository;
    }

    @GetMapping("/consulta")
    public Map<String, String> preguntarIa(@RequestParam String pregunta) {
        List<TareaDTO> tareas = taskRepository.findTaskSummaries().stream()
                .map(task -> new TareaDTO(
                        task.getCodigo(),
                        task.getNombre(),
                        task.getEstado(),
                        task.getResponsable(),
                        task.getPrioridad()
                ))
                .toList();

        String respuesta = iaService.generarRespuestaSobreTareas(pregunta, tareas);
        return Map.of("respuesta", respuesta);
    }
}
