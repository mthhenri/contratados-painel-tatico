import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ParticipantCondition } from '../../services/conditions.service';

@Component({
  selector: 'app-condition-badge',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './condition-badge.component.html',
  styleUrl: './condition-badge.component.scss',
})
export class ConditionBadgeComponent {
  @Input() condition!: ParticipantCondition;
  @Input() readonly = false;
  @Output() onRemove = new EventEmitter<string>();

  remove(): void {
    this.onRemove.emit(this.condition.id);
  }
}
