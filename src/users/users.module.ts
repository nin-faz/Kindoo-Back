import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
