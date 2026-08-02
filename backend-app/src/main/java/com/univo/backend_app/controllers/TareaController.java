package com.univo.backend_app.controllers;

import com.univo.backend_app.models.TaskEntity;
import com.univo.backend_app.models.TareaDTO;
import com.univo.backend_app.repositories.ProjectRepository;
import com.univo.backend_app.repositories.TaskRepository;
import com.univo.backend_app.repositories.TaskSummaryProjection;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tareas")
public class TareaController {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TareaController(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public List<TareaDTO> obtenerTareas() {
        return taskRepository.findTaskSummaries().stream()
                .map(this::toDto)
                .toList();
    }

    @PostMapping
    public Map<String, Object> crearTarea(@RequestBody TareaDTO tareaRecibida) {
        TaskEntity tarea = taskRepository.findById(parseTaskId(tareaRecibida.getCodigo()))
                .orElseGet(TaskEntity::new);

        if (tarea.getTaskId() == null) {
            tarea.setTaskId(parseTaskId(tareaRecibida.getCodigo()));
            tarea.setProjectId(defaultProjectId());
            tarea.setDueOn(LocalDate.now().plusDays(7));
        }

        tarea.setTaskTitle(tareaRecibida.getNombre());
        tarea.setTaskStatus(toDatabaseStatus(tareaRecibida.getEstado()));
        tarea.setPriorityLevel(toDatabasePriority(tareaRecibida.getPrioridad()));
        taskRepository.save(tarea);

        return Map.of(
                "mensaje", "Tarea persistida correctamente",
                "tarea", tareaRecibida
        );
    }

    private TareaDTO toDto(TaskSummaryProjection task) {
        return new TareaDTO(
                task.getCodigo(),
                task.getNombre(),
                task.getEstado(),
                task.getResponsable(),
                task.getPrioridad()
        );
    }

    private Integer parseTaskId(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            return Math.toIntExact(System.currentTimeMillis() % Integer.MAX_VALUE);
        }

        String digits = codigo.replaceAll("\\D+", "");
        if (digits.isBlank()) {
            return Math.toIntExact(System.currentTimeMillis() % Integer.MAX_VALUE);
        }

        return Integer.parseInt(digits);
    }

    private Integer defaultProjectId() {
        return projectRepository.findAll().stream()
                .findFirst()
                .map(project -> project.getProjectId())
                .orElse(101);
    }

    private String toDatabaseStatus(String estado) {
        String value = estado == null ? "" : estado.toLowerCase();
        if (value.contains("progreso")) return "in_progress";
        if (value.contains("bloque")) return "blocked";
        if (value.contains("complet") || value.contains("done")) return "done";
        return "todo";
    }

    private String toDatabasePriority(String prioridad) {
        String value = prioridad == null ? "" : prioridad.toLowerCase();
        if (value.contains("alta") || value.contains("urgent") || value.contains("high")) return "high";
        if (value.contains("baja") || value.contains("low")) return "low";
        return "medium";
    }
}
