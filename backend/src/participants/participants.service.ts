import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(sessionId: string, userId: string) {
    await this.assertSessionOwnership(sessionId, userId);

    const participants = await this.prisma.participant.findMany({
      where: { sessionId },
      orderBy: [{ initiative: { sort: 'desc', nulls: 'last' } }],
      include: {
        conditions: {
          include: { condition: true },
        },
      },
    });

    return participants.map((p) => ({
      ...p,
      conditions: p.conditions.map((pc) => ({
        id: pc.id,
        conditionId: pc.conditionId,
        name: pc.condition.name,
        duration: pc.duration,
      })),
    }));
  }

  async create(sessionId: string, userId: string, dto: CreateParticipantDto) {
    await this.assertSessionOwnership(sessionId, userId);

    const isCreature = dto.type === 'CREATURE';

    return this.prisma.participant.create({
      data: {
        sessionId,
        name: dto.name,
        type: dto.type,
        initiative: dto.initiative ?? null,
        maxHp: dto.maxHp,
        hp: dto.currentHp,
        maxEnergy: isCreature ? null : (dto.maxEnergy ?? null),
        energy: isCreature ? null : (dto.currentEnergy ?? null),
      },
    });
  }

  async update(
    sessionId: string,
    id: string,
    userId: string,
    dto: UpdateParticipantDto,
  ) {
    await this.assertSessionOwnership(sessionId, userId);
    await this.assertParticipantBelongsToSession(id, sessionId);

    return this.prisma.participant.update({
      where: { id },
      data: {
        ...(dto.initiative !== undefined && { initiative: dto.initiative }),
        ...(dto.maxHp !== undefined && { maxHp: dto.maxHp }),
        ...(dto.currentHp !== undefined && { hp: dto.currentHp }),
        ...(dto.maxEnergy !== undefined && { maxEnergy: dto.maxEnergy }),
        ...(dto.currentEnergy !== undefined && { energy: dto.currentEnergy }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async remove(sessionId: string, id: string, userId: string) {
    await this.assertSessionOwnership(sessionId, userId);
    await this.assertParticipantBelongsToSession(id, sessionId);

    await this.prisma.participant.delete({ where: { id } });
  }

  private async assertSessionOwnership(sessionId: string, userId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundException('Sessão não encontrada');
  }

  private async assertParticipantBelongsToSession(
    participantId: string,
    sessionId: string,
  ) {
    const participant = await this.prisma.participant.findFirst({
      where: { id: participantId, sessionId },
    });
    if (!participant) throw new NotFoundException('Participante não encontrado');
  }
}