import { Express, Router } from 'express';
import { Queue } from 'bullmq';

// ⚠️ bull-arena est en CommonJS, donc on l'importe avec require
const Arena = require('bull-arena');

// On crée un routeur Express séparé
const router: Router = require('express').Router();

// Configuration d'Arena
const arena = Arena(
  {
    BullMQ: Queue,
    queues: [
      {
        type: 'bullmq',
        name: 'healthCheck',
        hostId: 'Local',
        redis: {
          host: 'redis',
          port: 6379,
        },
      },
      {
        type: 'bullmq',
        name: 'messages',
        hostId: 'Local',
        redis: {
          host: 'redis',
          port: 6379,
        },
      },
    ],
  },
  {
    disableListen: true,
  }
);

// On monte Arena sur le routeur
router.use('/', arena);

// Fonction d'attachement au serveur Express
export function setupArena(app: Express) {
  app.use('/arena', router);
}