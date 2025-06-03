const Arena = require('bull-arena');
import { Queue } from 'bullmq';
import { Express } from 'express';

const arenaConfig = Arena(
  {
    BullMQ: Queue,
    queues: [
      {
        type: 'bullmq',
        name: 'healthCheck',
        hostId: 'Local',
        redis: {
          host: 'localhost',
          port: 6379,
        },
      },
      {
        type: 'bullmq',
        name: 'messages',
        hostId: 'Local',
        redis: {
          host: 'localhost',
          port: 6379,
        },
      },
    ],
  },
  {
    disableListen: true,
  }
);

export function setupArena(app: Express) {
  app.use('/arena', arenaConfig);
}