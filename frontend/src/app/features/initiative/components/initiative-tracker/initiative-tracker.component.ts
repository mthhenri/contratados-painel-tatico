import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionDetail } from '../../../sessions/services/sessions.service';
import { Participant } from '../../../participants/services/participants.service';
import { InitiativeService } from '../../services/initiative.service';

@Component({
  selector: 'app-initiative-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './initiative-tracker.component.html',
  styleUrl: './initiative-tracker.component.scss',
})
export class InitiativeTrackerComponent implements OnInit {
  @Input() session!: SessionDetail;
  @Input() readonly = false;

  private readonly initiativeService = inject(InitiativeService);

  currentTurn = signal<number>(0);
  activeParticipantId = signal<string | null>(null);
  participants = signal<Participant[]>([]);

  loading = false;
  error = '';

  private activeParticipants = computed(() =>
    [...this.participants()]
      .filter((p) => p.isActive)
      .sort((a, b) => {
        if (a.initiative === null && b.initiative === null) return 0;
        if (a.initiative === null) return 1;
        if (b.initiative === null) return -1;
        return b.initiative - a.initiative;
      }),
  );

  activeParticipant = computed(() => {
    const actives = this.activeParticipants();
    const id = this.activeParticipantId();
    return actives.find((p) => p.id === id) ?? null;
  });

  roundNumber = computed(() => {
    const count = this.activeParticipants().length;
    if (count === 0) return 1;
    return Math.floor(this.currentTurn() / count) + 1;
  });

  ngOnInit(): void {
    const sorted = [...(this.session.participants as Participant[])].sort((a, b) => {
      if (a.initiative === null && b.initiative === null) return 0;
      if (a.initiative === null) return 1;
      if (b.initiative === null) return -1;
      return b.initiative - a.initiative;
    });

    this.participants.set(sorted);
    this.currentTurn.set(this.session.currentTurn);

    const actives = sorted.filter((p) => p.isActive);
    const turn = this.session.currentTurn;
    const initial = actives.length > 0 ? actives[turn % actives.length] : null;
    this.activeParticipantId.set(initial?.id ?? null);
  }

  advance(): void {
    if (this.loading) return;
    this.loading = true;
    this.error = '';

    this.initiativeService.advance(this.session.id).subscribe({
      next: (res) => {
        this.currentTurn.set(res.currentTurn);
        this.activeParticipantId.set(res.activeParticipantId);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao avançar o turno.';
        this.loading = false;
      },
    });
  }

  reset(): void {
    if (this.loading) return;
    this.loading = true;
    this.error = '';

    this.initiativeService.reset(this.session.id).subscribe({
      next: (res) => {
        this.currentTurn.set(res.currentTurn);
        this.activeParticipantId.set(res.activeParticipantId);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao resetar o turno.';
        this.loading = false;
      },
    });
  }
}