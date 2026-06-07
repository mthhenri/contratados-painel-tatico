import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SessionsService, Session } from '../../services/sessions.service';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DialogModule],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.scss',
})
export class SessionListComponent implements OnInit {
  private readonly sessionsService = inject(SessionsService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly sessions = signal<Session[]>([]);
  readonly loading = signal(false);
  readonly dialogVisible = signal(false);
  readonly submitting = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly createForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  private static readonly STATUS_LABELS: Record<Session['status'], string> = {
    ACTIVE: 'Ativo',
    PAUSED: 'Pausado',
    FINISHED: 'Encerrado',
  };

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading.set(true);
    this.sessionsService.getSessions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.sessions.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
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

    const raw = this.createForm.value.name ?? '';
    const name = raw.trim();
    if (name.length < 3) {
      this.createForm.get('name')?.setErrors({ minlength: true });
      return;
    }

    this.submitting.set(true);
    this.errorMsg.set(null);

    this.sessionsService.createSession({ name })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.dialogVisible.set(false);
          this.loadSessions();
        },
        error: (err: Error) => {
          this.submitting.set(false);
          this.errorMsg.set(err.message);
        },
      });
  }

  openSession(id: string): void {
    this.router.navigate(['/sessions', id]);
  }

  statusLabel(status: Session['status']): string {
    return SessionListComponent.STATUS_LABELS[status] ?? status;
  }
}