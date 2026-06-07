import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export type ParticipantType = 'PC' | 'NPC' | 'CREATURE';

export interface Participant {
  id: string;
  sessionId: string;
  name: string;
  type: ParticipantType;
  initiative: number | null;
  hp: number;
  maxHp: number;
  energy: number | null;
  maxEnergy: number | null;
  isActive: boolean;
  conditions: { id: string; name: string; duration: number | null }[];
}

export interface CreateParticipantDto {
  name: string;
  type: ParticipantType;
  currentHp: number;
  maxHp: number;
  currentEnergy?: number;
  maxEnergy?: number;
  initiative?: number;
}

export interface UpdateParticipantDto {
  currentHp?: number;
  maxHp?: number;
  currentEnergy?: number;
  maxEnergy?: number;
  initiative?: number;
  isActive?: boolean;
}

interface ApiResponse<T> {
  data: T;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class ParticipantsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private base(sessionId: string): string {
    return `${this.apiUrl}/sessions/${sessionId}/participants`;
  }

  list(sessionId: string): Observable<Participant[]> {
    return this.http.get<ApiResponse<Participant[]>>(this.base(sessionId)).pipe(
      map((res) => res.data),
      catchError(() => throwError(() => new Error('Erro ao carregar participantes.'))),
    );
  }

  create(sessionId: string, dto: CreateParticipantDto): Observable<Participant> {
    return this.http.post<ApiResponse<Participant>>(this.base(sessionId), dto).pipe(
      map((res) => res.data),
      catchError(() => throwError(() => new Error('Erro ao criar participante.'))),
    );
  }

  update(sessionId: string, id: string, dto: UpdateParticipantDto): Observable<Participant> {
    return this.http.patch<ApiResponse<Participant>>(`${this.base(sessionId)}/${id}`, dto).pipe(
      map((res) => res.data),
      catchError((err) => {
        const msg = err.status === 404 ? 'Participante não encontrado.' : 'Erro ao atualizar participante.';
        return throwError(() => new Error(msg));
      }),
    );
  }

  remove(sessionId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.base(sessionId)}/${id}`).pipe(
      catchError((err) => {
        const msg = err.status === 404 ? 'Participante não encontrado.' : 'Erro ao remover participante.';
        return throwError(() => new Error(msg));
      }),
    );
  }
}