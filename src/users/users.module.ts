import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { BullModule } from '@nestjs/bullmq';

@Module({
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
