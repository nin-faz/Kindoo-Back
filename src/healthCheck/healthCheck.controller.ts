import { Controller, Get } from '@nestjs/common';
import { QueueService } from '../bullMQ/queue.service';
import { InjectQueue } from '@nestjs/bullmq';

@Controller('healthCheck')
export class HealthCheckController {
  constructor(
    @InjectQueue('healthCheck') private readonly queueService: QueueService,
  ) {}

  @Get('')
  async healthCheck() {
    await this.queueService.addJob('example-job', {
      message: 'Hello, BullMQ!',
      timestamp: new Date().toISOString(),
    });
    return { status: 'Job added to queue' };
  }
}
