import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';

export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
}

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsEnum(SessionStatus)
  status?: SessionStatus;
}
