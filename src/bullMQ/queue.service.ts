import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('messages') private readonly queue: Queue, // nom en minuscules
  ) {}

  async addJob(name: string, data: any) {
    console.log(`📤 Adding job "${name}" to queue with data:`, data);
    const job = await this.queue.add(name, data);
    console.log(`📋 Job added with ID: ${job.id}`);
    return job;
  }
}
