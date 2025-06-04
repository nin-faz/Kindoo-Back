import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { QueueService } from '../bullMQ/queue.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'messages',
    }),
  ],
  providers: [MessageResolver, MessageService, QueueService],
  exports: [BullModule],
})
export class MessageModule {}
