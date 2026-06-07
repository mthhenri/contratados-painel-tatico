import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApplyConditionDto {
  @ApiProperty({ description: 'ID da condição do catálogo' })
  @IsString()
  conditionId!: string;

  @ApiPropertyOptional({ example: 3, description: 'Duração em turnos (null = até cessar)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;
}
