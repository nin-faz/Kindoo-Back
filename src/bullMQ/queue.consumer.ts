import { Processor, Worker } from 'bullmq';

const worker = new Worker(
  'test-queue',
  async (job) => {
    console.log(`Processing job ${job.id}:`, job.data);
  },
  {
    connection: {
      host: 'localhost',
      port: 6379,
    },
  },
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});
