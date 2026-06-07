import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ example: 'Batalha da Floresta Sombria' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;
}
