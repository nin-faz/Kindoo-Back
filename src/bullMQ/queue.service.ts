import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('messages') private readonly queue: Queue, // nom en minuscules
  ) {}

  /**
   * Ajoute un job à la queue.
   * @param p_name Le nom du job
   * @param p_data Les données associées au job
   * @returns Le job ajouté
   */
  async addJob(p_name: string, p_data: any) {
    console.log(`📤 Adding job "${p_name}" to queue with data:`, p_data);
    const v_job = await this.queue.add(p_name, p_data);
    console.log(`📋 Job added with ID: ${v_job.id}`);
    return v_job;
  }
}
