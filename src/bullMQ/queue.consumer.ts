import { Worker } from 'bullmq';

const worker = new Worker(
  'messages',
  async (job) => {
    console.log(`🔄 Processing job ${job.id}:`, job.data);
    console.log(`📝 Job name: ${job.name}`);
    console.log(`⏰ Job timestamp: ${new Date(job.timestamp).toISOString()}`);
    console.log(`✅ Job ${job.id} completed successfully`);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: 6379,
    },
  },
);

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

worker.on('ready', () => {
  console.log('Worker is ready and connected to Redis');
});

console.log('Worker started and listening for jobs...');

// Maintenir le processus actif
process.on('SIGINT', async () => {
  console.log('Shutting down worker...');
  await worker.close();
  process.exit(0);
});

// Log périodique pour confirmer que le worker est actif
setInterval(() => {
  console.log('Worker is still running...', new Date().toISOString());
}, 10000);
