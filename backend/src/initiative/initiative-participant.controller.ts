import {
  Controller,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { InitiativeService } from './initiative.service';

@UseGuards(AuthGuard)
@Controller('sessions/:sessionId/participants')
export class InitiativeParticipantController {
  constructor(private readonly initiative: InitiativeService) {}

  @Patch(':id/active')
  async toggleActive(
    @Param('sessionId') sessionId: string,
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    const data = await this.initiative.toggleActive(sessionId, id, req.user.id);
    return { data, error: null };
  }
}
