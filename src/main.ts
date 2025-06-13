import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupArena } from './bullArena/arena';
import { startWorker } from './bullMQ/queue.consumer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Récupère l'instance Express par défaut
  const expressApp = app.getHttpAdapter().getInstance();

  // Setup bull-arena avec Express directement
  setupArena(expressApp);

  await app.listen(process.env.PORT ?? 3000);

  startWorker();
}
bootstrap();
