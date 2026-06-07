import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import {
  ParticipantsService,
  Participant,
  ParticipantType,
  UpdateParticipantDto,
} from '../../services/participants.service';
import { ParticipantCardComponent, ParticipantUpdateEvent } from '../participant-card/participant-card.component';

@Component({
  selector: 'app-participant-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    SelectModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    ParticipantCardComponent,
  ],
  templateUrl: './participant-list.component.html',
  styleUrl: './participant-list.component.scss',
})
export class ParticipantListComponent implements OnInit {
  @Input() sessionId!: string;
  @Input() currentTurn = 0;

  private readonly service = inject(ParticipantsService);
  private readonly fb = inject(FormBuilder);

  participants = signal<Participant[]>([]);
  dialogVisible = false;
  submitting = false;
  error = '';

  sortedParticipants = computed(() => {
    return [...this.participants()].sort((a, b) => {
      if (a.initiative === null && b.initiative === null) return 0;
      if (a.initiative === null) return 1;
      if (b.initiative === null) return -1;
      return b.initiative - a.initiative;
    });
  });

  typeOptions: { label: string; value: ParticipantType }[] = [
    { label: 'PC', value: 'PC' },
    { label: 'NPC', value: 'NPC' },
    { label: 'Criatura', value: 'CREATURE' },
  ];

  form = this.fb.group({
    name: ['', Validators.required],
    type: ['PC' as ParticipantType, Validators.required],
    initiative: [null as number | null],
    maxHp: [1, [Validators.required, Validators.min(1)]],
    currentHp: [1, [Validators.required, Validators.min(0)]],
    maxEnergy: [null as number | null],
    currentEnergy: [null as number | null],
  });

  get selectedType(): ParticipantType {
    return this.form.get('type')?.value as ParticipantType ?? 'PC';
  }

  get showEnergy(): boolean {
    return this.selectedType !== 'CREATURE';
  }

  get activeParticipantId(): string | null {
    const sorted = this.sortedParticipants();
    if (sorted.length === 0) return null;
    const idx = this.currentTurn % sorted.length;
    return sorted[idx]?.id ?? null;
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.list(this.sessionId).subscribe({
      next: (list) => this.participants.set(list),
      error: () => (this.error = 'Erro ao carregar participantes.'),
    });
  }

  openDialog(): void {
    this.form.reset({ type: 'PC', maxHp: 1, currentHp: 1 });
    this.error = '';
    this.dialogVisible = true;
  }

  closeDialog(): void {
    this.dialogVisible = false;
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.submitting = true;

    const dto: any = {
      name: v.name!,
      type: v.type!,
      currentHp: v.currentHp ?? v.maxHp!,
      maxHp: v.maxHp!,
      initiative: v.initiative ?? undefined,
    };

    if (this.showEnergy) {
      dto.currentEnergy = v.currentEnergy ?? undefined;
      dto.maxEnergy = v.maxEnergy ?? undefined;
    }

    this.service.create(this.sessionId, dto).subscribe({
      next: () => {
        this.submitting = false;
        this.dialogVisible = false;
        this.load();
      },
      error: () => {
        this.submitting = false;
        this.error = 'Erro ao criar participante.';
      },
    });
  }

  handleUpdate(event: ParticipantUpdateEvent): void {
    const dto: UpdateParticipantDto = event.field === 'hp'
      ? { currentHp: event.value }
      : { currentEnergy: event.value };

    this.service.update(this.sessionId, event.participantId, dto).subscribe({
      next: () => this.load(),
      error: () => (this.error = 'Erro ao atualizar participante.'),
    });
  }
}