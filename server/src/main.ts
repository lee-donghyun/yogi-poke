import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { AppModule } from './app.module';

Sentry.init({
  dsn: 'https://80b9d57cecbc790b6d7013e52ff0f70b@o4505527670210560.ingest.us.sentry.io/4508529031380992',
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('query parser', 'extended');
  app.useLogger(['verbose']);
  app.enableCors({ origin: process.env.CLIENT_URL });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.PORT ?? 8080);
}
void bootstrap();
