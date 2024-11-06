import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization', // Permite headers customizados como Authorization
  });
  await app
    .listen(8000)
    .then(() => console.log('Server running on PORT 8000'))
    .catch((error) => console.error('DB not connected!', error));
}
bootstrap();
