import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [UsersModule, PrismaModule],
  providers: [ConversationResolver, ConversationService]
})
export class ConversationModule {}
