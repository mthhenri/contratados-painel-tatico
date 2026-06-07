import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Condition {
  id: string;
  name: string;
  description: string | null;
}

export interface ParticipantCondition {
  id: string;
  conditionId: string;
  name: string;
  description?: string | null;
  duration: number | null;
  appliedAt: string;
}

export interface ApplyConditionDto {
  conditionId: string;
  duration?: number;
}

interface ApiResponse<T> {
  data: T;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class ConditionsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCatalog(): Observable<Condition[]> {
    return this.http
      .get<ApiResponse<Condition[]>>(`${this.apiUrl}/conditions`)
      .pipe(
        map((res) => res.data),
        catchError(() =>
          throwError(() => new Error('Erro ao carregar o catálogo de condições.')),
        ),
      );
  }

  applyCondition(
    sessionId: string,
    participantId: string,
    dto: ApplyConditionDto,
  ): Observable<ParticipantCondition> {
    return this.http
      .post<ApiResponse<ParticipantCondition>>(
        `${this.apiUrl}/sessions/${sessionId}/participants/${participantId}/conditions`,
        dto,
      )
      .pipe(
        map((res) => res.data),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 409) {
            return throwError(() => new Error('Esta condição já está aplicada a este participante.'));
          }
          return throwError(() => new Error('Erro ao aplicar a condição.'));
        }),
      );
  }

  removeCondition(
    sessionId: string,
    participantId: string,
    conditionId: string,
  ): Observable<void> {
    return this.http
      .delete<void>(
        `${this.apiUrl}/sessions/${sessionId}/participants/${participantId}/conditions/${conditionId}`,
      )
      .pipe(
        catchError(() =>
          throwError(() => new Error('Erro ao remover a condição.')),
        ),
      );
  }
}
