import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { RuntimeConfigService } from '../config/runtime-config.service';

export const AUTH_TOKEN_KEY = 'auth_token';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly runtimeConfig = inject(RuntimeConfigService);
  private readonly loginUrl = this.runtimeConfig.apiUrl('/api/v1/auth/login');

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      tap(response => this.saveToken(response.token))
    );
  }

  saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    void this.router.navigate(['/login']);
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
