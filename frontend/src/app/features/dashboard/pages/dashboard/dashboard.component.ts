import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogModule } from 'primeng/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface Session {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'FINISHED';
  createdAt: string;
}

interface ApiResponse<T> {
  data: T;
  error: string | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly sessions = signal<Session[]>([]);
  readonly isLoading = signal(true);
  readonly dialogVisible = signal(false);
  readonly submitting = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly createForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  readonly activeSessions = computed(() =>
    this.sessions().filter((s) => s.status === 'ACTIVE').length
  );

  readonly totalSessions = computed(() => this.sessions().length);

  readonly finishedSessions = computed(() =>
    this.sessions().filter((s) => s.status === 'FINISHED').length
  );

  readonly lastActiveSession = computed(() => {
    const active = this.sessions()
      .filter((s) => s.status === 'ACTIVE')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return active[0] ?? null;
  });

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.isLoading.set(true);
    this.http
      .get<ApiResponse<Session[]>>(`${environment.apiUrl}/sessions`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.sessions.set(res.data ?? []);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  openSession(id: string): void {
    this.router.navigate(['/sessions', id]);
  }

  goToSessions(): void {
    this.router.navigate(['/sessions']);
  }

  openDialog(): void {
    this.createForm.reset();
    this.errorMsg.set(null);
    this.submitting.set(false);
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
  }

  submitCreate(): void {
    if (this.createForm.invalid || this.submitting()) return;

    const name = (this.createForm.value.name ?? '').trim();
    if (name.length < 3) {
      this.createForm.get('name')?.setErrors({ minlength: true });
      return;
    }

    this.submitting.set(true);
    this.errorMsg.set(null);

    this.http
      .post<ApiResponse<Session>>(`${environment.apiUrl}/sessions`, { name })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.submitting.set(false);
          this.dialogVisible.set(false);
          this.router.navigate(['/sessions', res.data.id]);
        },
        error: (err: { message?: string }) => {
          this.submitting.set(false);
          this.errorMsg.set(err?.message ?? 'Erro ao criar sessão. Tente novamente.');
        },
      });
  }
}
