import { Module } from '@nestjs/common';
import { InitiativeController } from './initiative.controller';
import { InitiativeParticipantController } from './initiative-participant.controller';
import { InitiativeService } from './initiative.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InitiativeController, InitiativeParticipantController],
  providers: [InitiativeService],
})
export class InitiativeModule {}
