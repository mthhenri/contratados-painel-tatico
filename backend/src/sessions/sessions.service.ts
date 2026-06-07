import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const session = await this.prisma.session.findFirst({
      where: { id, userId },
      include: {
        participants: {
          include: {
            conditions: {
              include: { condition: true },
            },
          },
        },
      },
    });

    if (!session) throw new NotFoundException('Sessão não encontrada');

    return {
      ...session,
      participants: session.participants.map((p) => ({
        ...p,
        conditions: p.conditions.map((pc) => ({
          id: pc.id,
          conditionId: pc.conditionId,
          name: pc.condition.name,
          duration: pc.duration,
        })),
      })),
    };
  }

  create(userId: string, dto: CreateSessionDto) {
    return this.prisma.session.create({
      data: {
        name: dto.name,
        userId,
        status: 'ACTIVE',
        currentTurn: 0,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateSessionDto) {
    await this.assertOwnership(id, userId);

    return this.prisma.session.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.assertOwnership(id, userId);
    await this.prisma.session.delete({ where: { id } });
  }

  private async assertOwnership(id: string, userId: string) {
    const session = await this.prisma.session.findFirst({ where: { id, userId } });
    if (!session) throw new NotFoundException('Sessão não encontrada');
  }
}
