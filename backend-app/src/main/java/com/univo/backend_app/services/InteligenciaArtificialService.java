package com.univo.backend_app.services;

import com.univo.backend_app.models.TareaDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InteligenciaArtificialService {
    private final ChatClient chatClient;
    private final boolean groqConfigured;

    public InteligenciaArtificialService(
            ChatClient.Builder chatClientBuilder,
            @Value("${GROQ_API_KEY:}") String groqApiKey
    ) {
        this.chatClient = chatClientBuilder.build();
        this.groqConfigured = groqApiKey != null && !groqApiKey.isBlank();
    }

    public String generarRespuestaSimple(String preguntaUsuario) {
        if (!groqConfigured) {
            return "La IA no esta configurada en este entorno. Define GROQ_API_KEY para habilitar el modulo inteligente.";
        }

        return chatClient.prompt()
                .user(preguntaUsuario)
                .call()
                .content();
    }

    public String generarRespuestaSobreTareas(String preguntaUsuario, List<TareaDTO> tareas) {
        if (!groqConfigured) {
            return "La IA no esta configurada en este entorno. Define GROQ_API_KEY para analizar las tareas con Groq.";
        }

        String contexto = tareas.stream()
                .map(tarea -> "- %s | %s | %s | %s | %s".formatted(
                        tarea.getCodigo(),
                        tarea.getNombre(),
                        tarea.getEstado(),
                        tarea.getResponsable(),
                        tarea.getPrioridad()
                ))
                .reduce("", (left, right) -> left + right + "\n");

        String systemPrompt = """
                Eres el asistente analitico de TaskHive. Responde en espanol, con recomendaciones concretas,
                usando exclusivamente el contexto de tareas cargado desde la base de datos.
                Si el usuario pide algo fuera del dominio, vuelve al estado, prioridad, responsables y riesgos del trabajo registrado.
                """;

        String userPrompt = """
                Tareas actuales:
                %s

                Consulta del usuario:
                %s
                """.formatted(contexto.isBlank() ? "No hay tareas registradas." : contexto, preguntaUsuario);

        return chatClient.prompt()
                .system(systemPrompt)
                .user(userPrompt)
                .call()
                .content();
    }
}
