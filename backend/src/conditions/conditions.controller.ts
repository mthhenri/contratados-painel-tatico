import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
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
import { ConditionsService } from './conditions.service';
import { ApplyConditionDto } from './dto/apply-condition.dto';

@ApiTags('conditions')
@ApiBearerAuth()
@Controller()
export class ConditionsController {
  constructor(private readonly conditionsService: ConditionsService) {}

  @UseGuards(AuthGuard)
  @Get('conditions')
  @ApiOperation({ summary: 'Listar catálogo completo de condições' })
  @ApiResponse({ status: 200, description: 'Lista das 28 condições do sistema.' })
  async getCatalog() {
    const data = await this.conditionsService.getCatalog();
    return { data, error: null };
  }

  @UseGuards(AuthGuard)
  @Post('sessions/:sessionId/participants/:participantId/conditions')
  @ApiOperation({ summary: 'Aplicar condição a um participante' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiParam({ name: 'participantId', description: 'ID do participante' })
  @ApiResponse({ status: 201, description: 'Condição aplicada.' })
  @ApiResponse({ status: 404, description: 'Sessão ou participante não encontrado.' })
  @ApiResponse({ status: 409, description: 'Condição já aplicada ao participante.' })
  async applyCondition(
    @Param('sessionId') sessionId: string,
    @Param('participantId') participantId: string,
    @Body() dto: ApplyConditionDto,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.conditionsService.applyCondition(
      sessionId,
      participantId,
      dto,
      req.user.id,
    );
    return { data, error: null };
  }

  @UseGuards(AuthGuard)
  @Delete('sessions/:sessionId/participants/:participantId/conditions/:conditionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover condição de um participante' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiParam({ name: 'participantId', description: 'ID do participante' })
  @ApiParam({ name: 'conditionId', description: 'ID da condição aplicada' })
  @ApiResponse({ status: 204, description: 'Condição removida.' })
  @ApiResponse({ status: 404, description: 'Condição não encontrada.' })
  async removeCondition(
    @Param('sessionId') sessionId: string,
    @Param('participantId') participantId: string,
    @Param('conditionId') conditionId: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.conditionsService.removeCondition(
      sessionId,
      participantId,
      conditionId,
      req.user.id,
    );
  }
}
