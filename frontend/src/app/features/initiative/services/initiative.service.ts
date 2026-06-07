import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Participant } from '../../participants/services/participants.service';

export interface InitiativeResponse {
  currentTurn: number;
  activeParticipantId: string | null;
}

interface ApiResponse<T> {
  data: T;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class InitiativeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  advance(sessionId: string): Observable<InitiativeResponse> {
    return this.http
      .post<ApiResponse<InitiativeResponse>>(
        `${this.apiUrl}/sessions/${sessionId}/initiative/advance`,
        {},
      )
      .pipe(
        map((res) => res.data),
        catchError(() => throwError(() => new Error('Erro ao avançar o turno.'))),
      );
  }

  reset(sessionId: string): Observable<InitiativeResponse> {
    return this.http
      .post<ApiResponse<InitiativeResponse>>(
        `${this.apiUrl}/sessions/${sessionId}/initiative/reset`,
        {},
      )
      .pipe(
        map((res) => res.data),
        catchError(() => throwError(() => new Error('Erro ao resetar o turno.'))),
      );
  }

  toggleActive(sessionId: string, participantId: string): Observable<Participant> {
    return this.http
      .patch<ApiResponse<Participant>>(
        `${this.apiUrl}/sessions/${sessionId}/participants/${participantId}/active`,
        {},
      )
      .pipe(
        map((res) => res.data),
        catchError(() => throwError(() => new Error('Erro ao alternar estado do participante.'))),
      );
  }
}
