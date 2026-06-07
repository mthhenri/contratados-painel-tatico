import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { ParticipantsModule } from './participants/participants.module';
import { InitiativeModule } from './initiative/initiative.module';
import { ConditionsModule } from './conditions/conditions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    SessionsModule,
    ParticipantsModule,
    InitiativeModule,
    ConditionsModule,
  ],
})
export class AppModule {}
