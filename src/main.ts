import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupArena } from './bullArena/arena';
import { startWorker } from './bullMQ/queue.consumer';
import { MessageGateway } from './message/message.gateway';

async function bootstrap() {
  const v_app = await NestFactory.create(AppModule);

  v_app.enableCors();

  // Récupère l'instance Express par défaut
  const expressApp = v_app.getHttpAdapter().getInstance();

  // Setup bull-arena avec Express directement
  setupArena(expressApp);

  await v_app.listen(process.env.PORT ?? 3000);

  startWorker(v_app.get(MessageGateway));
}
bootstrap();
