export class ConditionInResponseDto {
  id: string;
  name: string;
  duration: number | null;
}

export class ParticipantInSessionDto {
  id: string;
  name: string;
  type: string;
  initiative: number | null;
  hp: number;
  maxHp: number;
  energy: number | null;
  maxEnergy: number | null;
  isActive: boolean;
  conditions: ConditionInResponseDto[];
}

export class SessionResponseDto {
  id: string;
  name: string;
  status: string;
  currentTurn: number;
  createdAt: Date;
  updatedAt: Date;
}

export class SessionDetailResponseDto extends SessionResponseDto {
  participants: ParticipantInSessionDto[];
}
