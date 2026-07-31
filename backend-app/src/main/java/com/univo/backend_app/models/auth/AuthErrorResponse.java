package com.univo.backend_app.models.auth;

public class AuthErrorResponse {

    private final String error;

    public AuthErrorResponse(String error) {
        this.error = error;
    }

    public String getError() {
        return error;
    }
}
