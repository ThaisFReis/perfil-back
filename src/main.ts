import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Definir as opções CORS
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3001', // Permitir solicitações apenas deste domínio
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    credentials: true, // Permitir credenciais de cookies ou cabeçalhos
  };

  // Habilitar o CORS com as opções definidas
  app.enableCors(corsOptions);

  await app.listen(3000);
}
bootstrap();
