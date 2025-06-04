import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupArena } from './bullArena/arena';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  setupArena(app.getHttpAdapter().getInstance());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
