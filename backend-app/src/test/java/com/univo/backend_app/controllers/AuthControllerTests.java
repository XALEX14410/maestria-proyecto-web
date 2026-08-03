package com.univo.backend_app.controllers;

import com.univo.backend_app.services.JwtService;
import com.univo.backend_app.config.WebConfig;
import com.univo.backend_app.models.Usuario;
import com.univo.backend_app.repositories.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.blankOrNullString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import({JwtService.class, WebConfig.class})
@AutoConfigureMockMvc(addFilters = false)
@TestPropertySource(properties = {
        "app.jwt.expiration-ms=86400000",
        "app.cors.allowed-origins=http://localhost:4200,https://taskhive.vercel.app"
})
class AuthControllerTests {

    private static final String TEST_EMAIL = "auth-test@example.invalid";
    private static final String TEST_PASSWORD = UUID.randomUUID().toString();

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioRepository usuarioRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @DynamicPropertySource
    static void jwtProperties(DynamicPropertyRegistry registry) {
        registry.add("jwt.secret", () -> UUID.randomUUID().toString() + UUID.randomUUID());
    }

    @Test
    void loginWithValidCredentialsReturnsJwt() throws Exception {
        when(usuarioRepository.findByEmail(TEST_EMAIL))
                .thenReturn(Optional.of(new Usuario("Test User", TEST_EMAIL, "$2a$10$hashed-password")));
        when(passwordEncoder.matches(TEST_PASSWORD, "$2a$10$hashed-password")).thenReturn(true);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(loginJson(TEST_EMAIL.toUpperCase(), TEST_PASSWORD)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", not(blankOrNullString())))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiresIn").value(86400));
    }

    @Test
    void loginWithInvalidCredentialsReturnsUnauthorized() throws Exception {
        when(usuarioRepository.findByEmail(TEST_EMAIL))
                .thenReturn(Optional.of(new Usuario("Test User", TEST_EMAIL, "$2a$10$hashed-password")));
        when(passwordEncoder.matches(TEST_PASSWORD + "-invalid", "$2a$10$hashed-password")).thenReturn(false);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(loginJson(TEST_EMAIL, TEST_PASSWORD + "-invalid")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Credenciales incorrectas"));
    }

    @Test
    void loginWithIncompleteBodyDoesNotReturnServerError() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content("{\"email\":\"auth-test@example.invalid\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Credenciales incorrectas"));
    }

    @Test
    void corsAllowsAngularDevelopmentOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/auth/login")
                        .header("Origin", "http://localhost:4200")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "Content-Type,Authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:4200"));
    }

    @Test
    void corsAllowsConfiguredProductionOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/auth/login")
                        .header("Origin", "https://taskhive.vercel.app")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "Content-Type,Authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://taskhive.vercel.app"));
    }

    private String loginJson(String email, String password) {
        return """
                {"email":"%s","password":"%s"}
                """.formatted(email, password);
    }
}
