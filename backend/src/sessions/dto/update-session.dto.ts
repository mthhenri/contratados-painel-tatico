import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
}

export class UpdateSessionDto {
  @ApiPropertyOptional({ example: 'Novo nome da sessão' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ enum: SessionStatus, example: SessionStatus.PAUSED })
  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;
}
