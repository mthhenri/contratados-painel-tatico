import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyConditionDto } from './dto/apply-condition.dto';

@Injectable()
export class ConditionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCatalog() {
    return this.prisma.condition.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async applyCondition(
    sessionId: string,
    participantId: string,
    dto: ApplyConditionDto,
    userId: string,
  ) {
    await this.assertOwnership(sessionId, userId);
    await this.assertParticipantBelongsToSession(participantId, sessionId);

    const condition = await this.prisma.condition.findUnique({
      where: { id: dto.conditionId },
    });
    if (!condition) throw new NotFoundException('Condição não encontrada');

    const existing = await this.prisma.participantCondition.findFirst({
      where: { participantId, conditionId: dto.conditionId },
    });
    if (existing) {
      throw new ConflictException('Condição já está aplicada a este participante');
    }

    const applied = await this.prisma.participantCondition.create({
      data: {
        participantId,
        conditionId: dto.conditionId,
        duration: dto.duration ?? null,
      },
      include: { condition: true },
    });

    return {
      id: applied.id,
      conditionId: applied.conditionId,
      name: applied.condition.name,
      duration: applied.duration,
      appliedAt: applied.appliedAt,
    };
  }

  async removeCondition(
    sessionId: string,
    participantId: string,
    conditionId: string,
    userId: string,
  ) {
    await this.assertOwnership(sessionId, userId);
    await this.assertParticipantBelongsToSession(participantId, sessionId);

    const record = await this.prisma.participantCondition.findFirst({
      where: { id: conditionId, participantId },
    });
    if (!record) throw new NotFoundException('Condição aplicada não encontrada');

    await this.prisma.participantCondition.delete({ where: { id: conditionId } });
  }

  private async assertOwnership(sessionId: string, userId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundException('Sessão não encontrada');
    return session;
  }

  private async assertParticipantBelongsToSession(
    participantId: string,
    sessionId: string,
  ) {
    const participant = await this.prisma.participant.findFirst({
      where: { id: participantId, sessionId },
    });
    if (!participant) throw new NotFoundException('Participante não encontrado');
    return participant;
  }
}
