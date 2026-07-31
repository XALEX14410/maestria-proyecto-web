package com.univo.backend_app.controllers;

import com.univo.backend_app.models.auth.AuthErrorResponse;
import com.univo.backend_app.models.auth.LoginRequest;
import com.univo.backend_app.models.auth.LoginResponse;
import com.univo.backend_app.services.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private static final String ADMIN_EMAIL = "admin@univo.edu.mx";
    private static final String ADMIN_PASSWORD = "12345";
    private static final String ADMIN_ROLE = "ADMIN";

    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody(required = false) LoginRequest request) {
        if (!isValidCredentials(request)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthErrorResponse("Credenciales incorrectas"));
        }

        String token = jwtService.generateToken(request.getEmail(), ADMIN_ROLE);
        return ResponseEntity.ok(new LoginResponse(token, "Bearer", jwtService.getExpirationSeconds()));
    }

    private boolean isValidCredentials(LoginRequest request) {
        // Practica academica: sustituir por consulta a base de datos y password hasheado.
        return request != null
                && ADMIN_EMAIL.equalsIgnoreCase(request.getEmail())
                && ADMIN_PASSWORD.equals(request.getPassword());
    }
}
