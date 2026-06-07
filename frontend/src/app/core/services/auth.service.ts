import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export const AUTH_TOKEN_KEY = 'contratados_auth_token';
export const AUTH_USER_KEY = 'contratados_auth_user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(
    localStorage.getItem(AUTH_TOKEN_KEY),
  );
  private readonly _user = signal<AuthUser | null>(loadStoredUser());

  readonly isAuthenticated = computed(() => !!this._token());
  readonly token = this._token.asReadonly();
  readonly currentUser = this._user.asReadonly();

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
          this._token.set(res.accessToken);
          this._user.set(res.user);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
