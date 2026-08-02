package com.univo.backend_app.repositories;

import com.univo.backend_app.models.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Integer> {
    @Query(value = """
            SELECT
                CONCAT('TH-', t.task_id) AS codigo,
                t.task_title AS nombre,
                CASE t.task_status
                    WHEN 'todo' THEN 'Pendiente'
                    WHEN 'in_progress' THEN 'En progreso'
                    WHEN 'blocked' THEN 'Bloqueada'
                    WHEN 'done' THEN 'Completada'
                    ELSE t.task_status
                END AS estado,
                COALESCE(STRING_AGG(u.full_name, ', ' ORDER BY u.full_name), 'Sin asignar') AS responsable,
                CASE t.priority_level
                    WHEN 'low' THEN 'Baja'
                    WHEN 'medium' THEN 'Media'
                    WHEN 'high' THEN 'Alta'
                    ELSE t.priority_level
                END AS prioridad
            FROM tasks t
            LEFT JOIN task_assignments ta ON ta.task_id = t.task_id
            LEFT JOIN users_app u ON u.user_id = ta.user_id
            GROUP BY t.task_id, t.task_title, t.task_status, t.priority_level, t.due_on
            ORDER BY t.due_on NULLS LAST, t.task_id
            """, nativeQuery = true)
    List<TaskSummaryProjection> findTaskSummaries();
}
