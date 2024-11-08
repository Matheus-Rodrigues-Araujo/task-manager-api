import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const frontendUrl = process.env.FRONTEND_URL?.endsWith('/')
    ? process.env.FRONTEND_URL.slice(0, -1)
    : process.env.FRONTEND_URL;

  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  await app.listen(process.env.PORT);
}

bootstrap();
