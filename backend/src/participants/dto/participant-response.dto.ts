export class ParticipantResponseDto {
  id: string;
  sessionId: string;
  name: string;
  type: string;
  initiative: number | null;
  maxHp: number;
  currentHp: number;
  maxEnergy: number | null;
  currentEnergy: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}