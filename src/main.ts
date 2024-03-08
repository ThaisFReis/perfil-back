import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Definir as opções CORS
  const corsOptions: CorsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    credentials: true, // Permitir credenciais de cookies ou cabeçalhos
  };

  // Habilitar o CORS com as opções definidas
  app.enableCors(corsOptions);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
