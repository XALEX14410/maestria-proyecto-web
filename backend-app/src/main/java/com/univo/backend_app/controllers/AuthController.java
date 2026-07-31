package com.univo.backend_app.controllers;

import com.univo.backend_app.models.auth.AuthErrorResponse;
import com.univo.backend_app.models.auth.LoginRequest;
import com.univo.backend_app.models.auth.LoginResponse;
import com.univo.backend_app.repositories.UsuarioRepository;
import com.univo.backend_app.services.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private static final String DEFAULT_ROLE = "USER";

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public AuthController(JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody(required = false) LoginRequest request) {
        if (!isValidCredentials(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthErrorResponse("Credenciales incorrectas"));
        }

        String email = request.getEmail().trim().toLowerCase();
        String token = jwtService.generateToken(email, DEFAULT_ROLE);
        return ResponseEntity.ok(new LoginResponse(token, "Bearer", jwtService.getExpirationSeconds()));
    }

    private boolean isValidCredentials(LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            return false;
        }

        String email = request.getEmail().trim().toLowerCase();
        return usuarioRepository.findByEmail(email)
                .filter(usuario -> usuario.getPassword().equals(request.getPassword()))
                .isPresent();
    }
}
