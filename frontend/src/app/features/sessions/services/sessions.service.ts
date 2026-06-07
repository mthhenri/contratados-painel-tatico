import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export type SessionStatus = 'ACTIVE' | 'PAUSED' | 'FINISHED';

export interface Session {
  id: string;
  name: string;
  status: SessionStatus;
  currentTurn: number;
  createdAt: string;
  updatedAt: string;
}

export interface SessionDetail extends Session {
  participants: SessionParticipant[];
}

export interface SessionParticipant {
  id: string;
  name: string;
  type: 'PC' | 'NPC' | 'CREATURE';
  initiative: number | null;
  hp: number;
  maxHp: number;
  energy: number | null;
  maxEnergy: number | null;
  isActive: boolean;
  conditions: { id: string; name: string; duration: number | null }[];
}

export interface CreateSessionDto {
  name: string;
}

export interface UpdateSessionDto {
  name?: string;
  status?: SessionStatus;
}

interface ApiResponse<T> {
  data: T;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class SessionsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/sessions`;

  getSessions(): Observable<Session[]> {
    return this.http.get<ApiResponse<Session[]>>(this.base).pipe(
      map((res) => res.data),
      catchError(() => throwError(() => new Error('Erro ao carregar sessões.'))),
    );
  }

  getSession(id: string): Observable<SessionDetail> {
    return this.http.get<ApiResponse<SessionDetail>>(`${this.base}/${id}`).pipe(
      map((res) => res.data),
      catchError((err) => {
        const msg = err.status === 404 ? 'Sessão não encontrada.' : 'Erro ao carregar sessão.';
        return throwError(() => new Error(msg));
      }),
    );
  }

  createSession(dto: CreateSessionDto): Observable<Session> {
    return this.http.post<ApiResponse<Session>>(this.base, dto).pipe(
      map((res) => res.data),
      catchError(() => throwError(() => new Error('Erro ao criar sessão.'))),
    );
  }

  updateSession(id: string, dto: UpdateSessionDto): Observable<Session> {
    return this.http.patch<ApiResponse<Session>>(`${this.base}/${id}`, dto).pipe(
      map((res) => res.data),
      catchError((err) => {
        const msg = err.status === 404 ? 'Sessão não encontrada.' : 'Erro ao atualizar sessão.';
        return throwError(() => new Error(msg));
      }),
    );
  }

  deleteSession(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      catchError((err) => {
        const msg = err.status === 404 ? 'Sessão não encontrada.' : 'Erro ao remover sessão.';
        return throwError(() => new Error(msg));
      }),
    );
  }
}