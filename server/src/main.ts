import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const httpsOptions = {
    cert: readFileSync(join(__dirname, '../certification/fullchain.pem')),
    key: readFileSync(join(__dirname, '../certification/privkey.pem')),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors({ origin: process.env.CLIENT_URL });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
