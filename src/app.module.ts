import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { HealthCheckController } from './healthCheck/healthCheck.controller';
import { QueueService } from './bullMQ/queue.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageService } from './message/message.service';
import { ConversationService } from './conversation/conversation.service';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'healthCheck',
    }),

    
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    UsersModule,
    MessageModule,
    ConversationModule,
    AuthModule,
  ],
  controllers: [AppController, HealthCheckController],
  providers: [AppService, QueueService, MessageService, ConversationService, UsersService, AuthService],
})
export class AppModule {}

