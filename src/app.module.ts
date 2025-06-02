import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { HealthCheckController } from './healthCheck/healthCheck.controller';
import { QueueService } from './bullMQ/queue.service'

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
  ],
  controllers: [AppController, HealthCheckController],
  providers: [AppService, QueueService],
})
export class AppModule {}
