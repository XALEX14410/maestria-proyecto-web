package com.univo.backend_app.services;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final ChatClient chatClient;

    public AIService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String analizarPrioridadTarea(String textoUsuario) {
        String systemPrompt = "Eres un experto en gestión de tareas y soporte técnico. " +
                "Clasifica la prioridad del siguiente texto de tarea en ALTA, MEDIA o BAJA. " +
                "Responde exclusivamente con una de esas tres palabras, sin puntos ni texto extra.";

        return chatClient.prompt()
                .system(systemPrompt)
                .user(textoUsuario)
                .call()
                .content();
    }
}
