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
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@ApiTags('sessions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar sessões do mestre autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de sessões.' })
  async findAll(@Request() req: { user: { id: string } }) {
    const data = await this.sessions.findAll(req.user.id);
    return { data, error: null };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar sessão por ID com participantes' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ status: 200, description: 'Sessão encontrada.' })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
  async findOne(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.sessions.findOne(id, req.user.id);
    return { data, error: null };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova sessão' })
  @ApiResponse({ status: 201, description: 'Sessão criada.' })
  async create(
    @Body() dto: CreateSessionDto,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.sessions.create(req.user.id, dto);
    return { data, error: null };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar sessão (nome e/ou status)' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ status: 200, description: 'Sessão atualizada.' })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSessionDto,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.sessions.update(id, req.user.id, dto);
    return { data, error: null };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover sessão' })
  @ApiParam({ name: 'id', description: 'ID da sessão' })
  @ApiResponse({ status: 204, description: 'Sessão removida.' })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
  async remove(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.sessions.remove(id, req.user.id);
  }
}
