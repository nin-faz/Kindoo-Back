import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';
import { BullModule } from '@nestjs/bullmq';

@Module({
  providers: [ConversationResolver, ConversationService],
})
export class ConversationModule {}
