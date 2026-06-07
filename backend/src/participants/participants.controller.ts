import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
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
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@ApiTags('participants')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('sessions/:sessionId/participants')
export class ParticipantsController {
  constructor(private readonly participants: ParticipantsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar participantes de uma sessão' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiResponse({ status: 200, description: 'Lista de participantes ordenada por iniciativa.' })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
  async findAll(
    @Param('sessionId') sessionId: string,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.participants.findAll(sessionId, req.user.id);
    return { data, error: null };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adicionar participante à sessão' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiResponse({ status: 201, description: 'Participante criado.' })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
  async create(
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateParticipantDto,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.participants.create(sessionId, req.user.id, dto);
    return { data, error: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar atributos de um participante' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiParam({ name: 'id', description: 'ID do participante' })
  @ApiResponse({ status: 200, description: 'Participante atualizado.' })
  @ApiResponse({ status: 404, description: 'Participante não encontrado.' })
  async update(
    @Param('sessionId') sessionId: string,
    @Param('id') id: string,
    @Body() dto: UpdateParticipantDto,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.participants.update(sessionId, id, req.user.id, dto);
    return { data, error: null };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover participante da sessão' })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão' })
  @ApiParam({ name: 'id', description: 'ID do participante' })
  @ApiResponse({ status: 204, description: 'Participante removido.' })
  @ApiResponse({ status: 404, description: 'Participante não encontrado.' })
  async remove(
    @Param('sessionId') sessionId: string,
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.participants.remove(sessionId, id, req.user.id);
  }
}
