import { Worker } from 'bullmq';
import { MessageGateway } from 'src/message/message.gateway';

export function startWorker(p_gateway: MessageGateway) {
  if (!process.env.REDIS_HOST) {
    throw new Error('❌ REDIS_HOST is not defined');
  }

  const worker = new Worker(
    'messages',
    async (job) => {
      console.log(`🔄 Processing job ${job.id}:`, job.data);
      console.log(`📝 Job name: ${job.name}`);
      console.log(`⏰ Job timestamp: ${new Date(job.timestamp).toISOString()}`);

      p_gateway.sendNewMessage(job.data);
    },
    {
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        ...(process.env.REDIS_TLS === 'true' ? { tls: {} } : {}),
      },
    },
  );

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err);
  });

  worker.on('error', (err) => {
    console.error('🚨 Worker error:', err);
  });

  worker.on('ready', () => {
    console.log('✅ Worker is ready and connected to Redis');
  });

  console.log('🚀 Worker started and listening for jobs...');

  // Fermer proprement à l'arrêt
  process.on('SIGINT', async () => {
    console.log('🛑 Shutting down worker...');
    await worker.close();
    process.exit(0);
  });

  // Log périodique pour savoir que le worker tourne
  setInterval(() => {
    console.log('⏱️ Worker is still running...', new Date().toISOString());
  }, 10000);
}
