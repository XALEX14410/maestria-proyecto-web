package com.univo.backend_app.services;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final ChatClient chatClient;
    private final boolean groqConfigured;

    public AIService(
            ChatClient.Builder chatClientBuilder,
            @Value("${GROQ_API_KEY:}") String groqApiKey
    ) {
        this.chatClient = chatClientBuilder.build();
        this.groqConfigured = groqApiKey != null && !groqApiKey.isBlank();
    }

    public String analizarPrioridadTarea(String textoUsuario) {
        if (!groqConfigured) {
            return "IA_NO_CONFIGURADA";
        }

        String systemPrompt = "Eres un experto en gestion de tareas y soporte tecnico. " +
                "Clasifica la prioridad del siguiente texto de tarea en ALTA, MEDIA o BAJA. " +
                "Responde exclusivamente con una de esas tres palabras, sin puntos ni texto extra.";

        return chatClient.prompt()
                .system(systemPrompt)
                .user(textoUsuario)
                .call()
                .content();
    }
}
