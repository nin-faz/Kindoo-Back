import { Controller, Get } from '@nestjs/common';
import { QueueService } from 'src/bullMQ/queue.service';
import { InjectQueue } from '@nestjs/bullmq';
// import { Queue } from 'bullmq';

@Controller('healthCheck')
export class HealthCheckController {
  constructor(
    @InjectQueue('healthCheck') private readonly queueService: QueueService,
  ) {}

  @Get('')
  async healthCheck() {
    await this.queueService.addJob('example-job', {
      message: 'Hello, BullMQ!',
    });
    return { status: 'Job added to queue' };
  }
}
