import { IsOptional, IsInt, IsBoolean, Min } from 'class-validator';

export class UpdateParticipantDto {
  @IsOptional()
  @IsInt()
  initiative?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxHp?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentHp?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxEnergy?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentEnergy?: number | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}