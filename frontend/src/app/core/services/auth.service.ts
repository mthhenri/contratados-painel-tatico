import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export const AUTH_TOKEN_KEY = 'contratados_auth_token';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(
    localStorage.getItem(AUTH_TOKEN_KEY),
  );

  readonly isAuthenticated = computed(() => !!this._token());
  readonly token = this._token.asReadonly();

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken);
          this._token.set(res.accessToken);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/login']);
  }
}
