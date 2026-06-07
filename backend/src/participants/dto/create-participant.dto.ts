import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export enum ParticipantTypeDto {
  PC = 'PC',
  NPC = 'NPC',
  CREATURE = 'CREATURE',
}

export class CreateParticipantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsEnum(ParticipantTypeDto)
  type: ParticipantTypeDto;

  @IsOptional()
  @IsInt()
  initiative?: number;

  @IsInt()
  @Min(0)
  maxHp: number;

  @IsInt()
  @Min(0)
  currentHp: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxEnergy?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentEnergy?: number;
}