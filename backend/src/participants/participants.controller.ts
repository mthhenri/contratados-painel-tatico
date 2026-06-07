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
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@UseGuards(AuthGuard)
@Controller('sessions/:sessionId/participants')
export class ParticipantsController {
  constructor(private readonly participants: ParticipantsService) {}

  @Get()
  async findAll(
    @Param('sessionId') sessionId: string,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.participants.findAll(sessionId, req.user.id);
    return { data, error: null };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('sessionId') sessionId: string,
    @Body() dto: CreateParticipantDto,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.participants.create(sessionId, req.user.id, dto);
    return { data, error: null };
  }

  @Patch(':id')
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
  async remove(
    @Param('sessionId') sessionId: string,
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.participants.remove(sessionId, id, req.user.id);
  }
}