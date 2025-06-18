import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'prisma/prisma.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [UsersModule, PrismaModule, EventEmitterModule.forRoot()],
  providers: [ConversationResolver, ConversationService]
})
export class ConversationModule {}
