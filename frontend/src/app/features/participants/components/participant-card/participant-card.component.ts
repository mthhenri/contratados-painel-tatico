import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Participant } from '../../services/participants.service';

export interface ParticipantUpdateEvent {
  participantId: string;
  field: 'hp' | 'energy';
  value: number;
}

@Component({
  selector: 'app-participant-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participant-card.component.html',
  styleUrl: './participant-card.component.scss',
})
export class ParticipantCardComponent {
  @Input() participant!: Participant;
  @Input() isActive = false;
  @Output() onUpdate = new EventEmitter<ParticipantUpdateEvent>();

  editingHp = false;
  editingEnergy = false;
  editHpValue = 0;
  editEnergyValue = 0;

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
}