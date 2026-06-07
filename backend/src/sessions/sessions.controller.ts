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
import { AuthGuard } from '../auth/auth.guard';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@UseGuards(AuthGuard)
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessions: SessionsService) {}

  @Get()
  async findAll(@Request() req: { user: { id: string } }) {
    const data = await this.sessions.findAll(req.user.id);
    return { data, error: null };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.sessions.findOne(id, req.user.id);
    return { data, error: null };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateSessionDto,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.sessions.create(req.user.id, dto);
    return { data, error: null };
  }

  @Patch(':id')
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
  async remove(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.sessions.remove(id, req.user.id);
  }
}
