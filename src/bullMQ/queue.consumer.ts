import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

if (!process.env.REDIS_HOST) {
  throw new Error('❌ REDIS_HOST is not defined');
}

const worker = new Worker(
  'messages',
  async (job) => {
    console.log(`🔄 Processing job ${job.id}:`, job.data);
    console.log(`📝 Job name: ${job.name}`);
    console.log(`⏰ Job timestamp: ${new Date(job.timestamp).toISOString()}`);

    // Création du message en BDD via Prisma
    const v_savedMessage = await prisma.message.create({
      data: {
        id: job.data.messageId,
        content: job.data.content,
        createdAt: new Date(job.data.createdAt),
        authorId: job.data.authorId,
        conversationId: job.data.conversationId,
      },
    });

    console.log(`✅ Message enregistré en BDD avec l'id: ${v_savedMessage.id}`);
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) || 6379,
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
