import { PrismaClient } from '@prisma/client';
import { Worker } from 'bullmq';
import { MessageGateway } from 'src/message/message.gateway';

const v_prisma = new PrismaClient();

/**
 * Démarre le worker BullMQ pour traiter les messages.
 * @param p_gateway L'instance de MessageGateway pour envoyer les messages traités.
 */
export function startWorker(p_gateway: MessageGateway) {
  if (!process.env.REDIS_HOST) {
    throw new Error('❌ REDIS_HOST is not defined');
  }

  const v_worker = new Worker(
    'messages',
    async (p_job) => {
      console.log(`🔄 Processing job ${p_job.id}:`, p_job.data);
      console.log(`📝 Job name: ${p_job.name}`);
      console.log(`⏰ Job timestamp: ${new Date(p_job.timestamp).toISOString()}`);

      const v_savedMessage = await v_prisma.message.create({
        data: {
          id: p_job.data.messageId,
          content: p_job.data.content,
          createdAt: new Date(p_job.data.createdAt),
          authorId: p_job.data.authorId,
          conversationId: p_job.data.conversationId,
        },
      });

      console.log(`✅ Message enregistré en BDD avec l'id: ${v_savedMessage.id}`);

      p_gateway.sendNewMessage(p_job.data);
      console.log(`📤 Message envoyé au WebSocket: ${p_job.data.messageId}`);
    },
    {
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    },
  );

  v_worker.on('failed', (p_job, err) => {
    console.error(`❌ Job ${p_job?.id} failed:`, err);
  });

  v_worker.on('error', (err) => {
    console.error('🚨 Worker error:', err);
  });

  v_worker.on('ready', () => {
    console.log('✅ Worker is ready and connected to Redis');
  });

  console.log('🚀 Worker started and listening for jobs...');

  // Fermer proprement à l'arrêt
  process.on('SIGINT', async () => {
    console.log('🛑 Shutting down worker...');
    await v_worker.close();
    process.exit(0);
  });

  // Log périodique pour savoir que le worker tourne
  setInterval(() => {
    console.log('⏱️ Worker is still running...', new Date().toISOString());
  }, 10000);
}
