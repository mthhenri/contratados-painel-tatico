import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { Participant } from '../../services/participants.service';
import {
  ConditionsService,
  Condition,
  ParticipantCondition,
} from '../../../conditions/services/conditions.service';
import { ConditionBadgeComponent } from '../../../conditions/components/condition-badge/condition-badge.component';

export interface ParticipantUpdateEvent {
  participantId: string;
  field: 'hp' | 'energy';
  value: number;
}

@Component({
  selector: 'app-participant-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    InputNumberModule,
    ConditionBadgeComponent,
  ],
  templateUrl: './participant-card.component.html',
  styleUrl: './participant-card.component.scss',
})
export class ParticipantCardComponent implements OnInit {
  @Input() participant!: Participant;
  @Input() sessionId!: string;
  @Input() isActive = false;
  @Output() onUpdate = new EventEmitter<ParticipantUpdateEvent>();
  @Output() onReload = new EventEmitter<void>();

  private readonly conditionsService = inject(ConditionsService);

  editingHp = false;
  editingEnergy = false;
  editHpValue = 0;
  editEnergyValue = 0;

  catalog = signal<Condition[]>([]);
  selectedConditionId: string | null = null;
  conditionDuration: number | null = null;
  applyingCondition = false;
  conditionError = '';

  get isCreature(): boolean {
    return this.participant.type === 'CREATURE';
  }

  get isDead(): boolean {
    return !this.participant.isActive && this.participant.hp === 0;
  }

  get hpPercent(): number {
    if (this.participant.maxHp === 0) return 0;
    return (this.participant.hp / this.participant.maxHp) * 100;
  }

  get hpCritical(): boolean {
    return this.hpPercent <= 30;
  }

  get typeLabel(): string {
    const labels: Record<string, string> = { PC: 'PC', NPC: 'NPC', CREATURE: 'Criatura' };
    return labels[this.participant.type] ?? this.participant.type;
  }

  get enrichedConditions(): ParticipantCondition[] {
    const catalogMap = new Map(this.catalog().map((c) => [c.id, c.description]));
    return (this.participant.conditions ?? []).map((pc) => ({
      ...pc,
      description: catalogMap.get(pc.conditionId) ?? null,
    }));
  }

  get catalogOptions(): { label: string; value: string }[] {
    return this.catalog().map((c) => ({ label: c.name, value: c.id }));
  }

  ngOnInit(): void {
    this.conditionsService.getCatalog().subscribe({
      next: (list) => this.catalog.set(list),
    });
  }

  startEditHp(): void {
    this.editHpValue = this.participant.hp;
    this.editingHp = true;
  }

  confirmHp(): void {
    this.editingHp = false;
    if (this.editHpValue !== this.participant.hp) {
      this.onUpdate.emit({ participantId: this.participant.id, field: 'hp', value: this.editHpValue });
    }
  }

  cancelHp(): void {
    this.editingHp = false;
  }

  startEditEnergy(): void {
    this.editEnergyValue = this.participant.energy ?? 0;
    this.editingEnergy = true;
  }

  confirmEnergy(): void {
    this.editingEnergy = false;
    if (this.editEnergyValue !== this.participant.energy) {
      this.onUpdate.emit({ participantId: this.participant.id, field: 'energy', value: this.editEnergyValue });
    }
  }

  cancelEnergy(): void {
    this.editingEnergy = false;
  }

  applyCondition(): void {
    if (!this.selectedConditionId || !this.sessionId) return;
    this.conditionError = '';
    this.applyingCondition = true;

    const dto = {
      conditionId: this.selectedConditionId,
      ...(this.conditionDuration !== null ? { duration: this.conditionDuration } : {}),
    };

    this.conditionsService
      .applyCondition(this.sessionId, this.participant.id, dto)
      .subscribe({
        next: () => {
          this.applyingCondition = false;
          this.selectedConditionId = null;
          this.conditionDuration = null;
          this.onReload.emit();
        },
        error: (err: Error) => {
          this.applyingCondition = false;
          this.conditionError =
            err.message.includes('já está aplicada')
              ? 'Condição já aplicada'
              : err.message;
        },
      });
  }

  removeCondition(conditionId: string): void {
    if (!this.sessionId) return;
    this.conditionsService
      .removeCondition(this.sessionId, this.participant.id, conditionId)
      .subscribe({
        next: () => this.onReload.emit(),
      });
  }
}
