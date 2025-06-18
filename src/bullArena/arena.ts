import { Express, Router } from 'express';
import { Queue } from 'bullmq';

// ⚠️ bull-arena est en CommonJS, donc on l'importe avec require
const Arena = require('bull-arena');

// On crée un routeur Express séparé
const router: Router = require('express').Router();

/**
 * Configuration de Bull Arena pour la gestion des queues BullMQ.
 */
const arena = Arena(
  {
    BullMQ: Queue,
    queues: [
      {
        type: 'bullmq',
        name: 'messages',
        hostId: 'Local',
        redis: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT) || 6379,
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