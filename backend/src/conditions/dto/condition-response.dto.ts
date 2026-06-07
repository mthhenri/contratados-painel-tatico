export class ConditionResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
}

export class ParticipantConditionResponseDto {
  id!: string;
  conditionId!: string;
  name!: string;
  duration!: number | null;
  appliedAt!: Date;
}
