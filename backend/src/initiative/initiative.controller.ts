import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { InitiativeService } from './initiative.service';

@ApiTags('initiative')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('sessions/:sessionId/initiative')
export class InitiativeController {
  constructor(private readonly initiative: InitiativeService) {}

  @Post('advance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Avançar turno na ordem de iniciativa' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiResponse({ status: 200, description: 'Turno avançado; retorna currentTurn e activeParticipantId.' })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
  async advance(
    @Param('sessionId') sessionId: string,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.initiative.advance(sessionId, req.user.id);
    return { data, error: null };
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resetar iniciativa para o turno 1' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiResponse({ status: 200, description: 'Iniciativa resetada; retorna currentTurn e activeParticipantId.' })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
  async reset(
    @Param('sessionId') sessionId: string,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.initiative.reset(sessionId, req.user.id);
    return { data, error: null };
  }
}
