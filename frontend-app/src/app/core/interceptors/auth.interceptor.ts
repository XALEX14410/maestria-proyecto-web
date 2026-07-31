import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isBackendRequest = req.url.startsWith(environment.apiBaseUrl) || req.url.startsWith('/api/');
  const isLoginRequest = req.url.includes('/api/v1/auth/login');
  const token = isBackendRequest && !isLoginRequest ? authService.getToken() : null;

  if (!token || req.headers.has('Authorization')) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
};
