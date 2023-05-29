import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['42'], // private key
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //any additional properties on body will be stripped out
    }),
  );
  await app.listen(3000);
}
bootstrap();
