import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ParticipantTypeDto {
  PC = 'PC',
  NPC = 'NPC',
  CREATURE = 'CREATURE',
}

export class CreateParticipantDto {
  @ApiProperty({ example: 'Goblin Guerreiro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ enum: ParticipantTypeDto, example: ParticipantTypeDto.CREATURE })
  @IsEnum(ParticipantTypeDto)
  type!: ParticipantTypeDto;

  @ApiPropertyOptional({ example: 12, description: 'Valor de iniciativa (opcional)' })
  @IsOptional()
  @IsInt()
  initiative?: number;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(0)
  maxHp!: number;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(0)
  currentHp!: number;

  @ApiPropertyOptional({ example: 10, description: 'Apenas para PC e NPC' })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxEnergy?: number;

  @ApiPropertyOptional({ example: 10, description: 'Apenas para PC e NPC' })
  @IsOptional()
  @IsInt()
  @Min(0)
  currentEnergy?: number;
}
