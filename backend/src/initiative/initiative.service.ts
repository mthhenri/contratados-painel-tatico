import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InitiativeService {
  constructor(private readonly prisma: PrismaService) {}

  async advance(sessionId: string, userId: string) {
    const session = await this.assertOwnership(sessionId, userId);
    const actives = await this.getActiveParticipants(sessionId);

    if (actives.length === 0) {
      return { currentTurn: session.currentTurn, activeParticipantId: null };
    }

    const next = session.currentTurn + 1;

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { currentTurn: next },
    });

    return { currentTurn: next, activeParticipantId: actives[next % actives.length].id };
  }

  async reset(sessionId: string, userId: string) {
    await this.assertOwnership(sessionId, userId);
    const actives = await this.getActiveParticipants(sessionId);

    await this.prisma.session.update({
      where: { id: sessionId },
      data: { currentTurn: 0 },
    });

    return {
      currentTurn: 0,
      activeParticipantId: actives[0]?.id ?? null,
    };
  }

  async toggleActive(sessionId: string, participantId: string, userId: string) {
    const session = await this.assertOwnership(sessionId, userId);
    const participant = await this.assertParticipantOwnership(participantId, sessionId);

    const activesBefore = await this.getActiveParticipants(sessionId);
    const isCurrentlyActive = activesBefore[session.currentTurn]?.id === participantId;
    const newIsActive = !participant.isActive;

    const updated = await this.prisma.participant.update({
      where: { id: participantId },
      data: { isActive: newIsActive },
    });

    // If we just deactivated the current active participant, advance the turn
    if (!newIsActive && isCurrentlyActive) {
      const activesAfter = await this.getActiveParticipants(sessionId);
      if (activesAfter.length > 0) {
        const next = session.currentTurn % activesAfter.length;
        await this.prisma.session.update({
          where: { id: sessionId },
          data: { currentTurn: next },
        });
      }
    }

    return updated;
  }

  private async getActiveParticipants(sessionId: string) {
    return this.prisma.participant.findMany({
      where: { sessionId, isActive: true },
      orderBy: [{ initiative: { sort: 'desc', nulls: 'last' } }],
    });
  }

  private async assertOwnership(sessionId: string, userId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundException('Sessão não encontrada');
    if (session.status === 'FINISHED') {
      throw new ForbiddenException('Sessão encerrada não pode ser alterada');
    }
    return session;
  }

  private async assertParticipantOwnership(participantId: string, sessionId: string) {
    const participant = await this.prisma.participant.findFirst({
      where: { id: participantId, sessionId },
    });
    if (!participant) throw new NotFoundException('Participante não encontrado');
    return participant;
  }
}
