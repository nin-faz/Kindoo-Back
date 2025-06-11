import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { QueueService } from '../bullMQ/queue.service';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'messages',
    }),
    PrismaModule
  ],
  providers: [MessageResolver, MessageService, QueueService],
  exports: [BullModule],
})
export class MessageModule {}
