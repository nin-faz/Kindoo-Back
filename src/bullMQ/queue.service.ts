import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  private readonly queue: Queue;

  constructor() {
    this.queue = new Queue('healthCheck', {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });
  }

  async addJob(name: string, data: any) {
    await this.queue.add(name, data);
  }
}
