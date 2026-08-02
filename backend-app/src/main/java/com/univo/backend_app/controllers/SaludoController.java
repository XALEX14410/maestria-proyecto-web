package com.univo.backend_app.controllers;

import com.univo.backend_app.models.Mensaje;
import com.univo.backend_app.repositories.MensajeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mensajes")
public class SaludoController {

    private final MensajeRepository repository;

    // Inyección de dependencias por constructor (Buena práctica de la industria)
    public SaludoController(MensajeRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Mensaje> listarMensajes() {
        return repository.findAll();
    }

    @PostMapping
    public Mensaje guardarMensaje(@RequestBody Mensaje nuevoMensaje) {
        return repository.save(nuevoMensaje);
    }
}
