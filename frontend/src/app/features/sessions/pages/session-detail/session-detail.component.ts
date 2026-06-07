import {
  Component,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SessionsService, SessionDetail } from '../../services/sessions.service';
import { InitiativeTrackerComponent } from '../../../initiative/components/initiative-tracker/initiative-tracker.component';
import { ParticipantListComponent } from '../../../participants/components/participant-list/participant-list.component';

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialogModule,
    InitiativeTrackerComponent,
    ParticipantListComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './session-detail.component.html',
  styleUrl: './session-detail.component.scss',
})
export class SessionDetailComponent implements OnInit {
  @ViewChild(InitiativeTrackerComponent) tracker!: InitiativeTrackerComponent;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sessionsService = inject(SessionsService);
  private readonly confirmationService = inject(ConfirmationService);

  session = signal<SessionDetail | null>(null);
  loading = signal(true);
  error = signal('');

  get activeParticipantId(): string | null {
    return this.tracker?.activeParticipantId() ?? null;
  }

  get currentTurn(): number {
    return this.tracker?.currentTurn() ?? 0;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.sessionsService.getSession(id).subscribe({
      next: (s) => {
        this.session.set(s);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  confirmEndSession(): void {
    this.confirmationService.confirm({
      message: 'Deseja encerrar esta sessão? Esta ação não pode ser desfeita.',
      header: 'Encerrar Sessão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Encerrar',
      rejectLabel: 'Cancelar',
      accept: () => this.endSession(),
    });
  }

  private endSession(): void {
    const s = this.session();
    if (!s) return;
    this.sessionsService.updateSession(s.id, { status: 'FINISHED' }).subscribe({
      next: () => this.router.navigate(['/sessions']),
      error: () => this.error.set('Erro ao encerrar a sessão.'),
    });
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      ACTIVE: 'Ativa',
      PAUSED: 'Pausada',
      FINISHED: 'Encerrada',
    };
    return map[status] ?? status;
  }

  goBack(): void {
    this.router.navigate(['/sessions']);
  }
}