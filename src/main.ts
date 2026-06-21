import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import helmet from 'helmet';
import { BusinessExceptionFilter } from './@shared/exceptions/business.exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const config = app.get(ConfigService);

  app.use(helmet());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new BusinessExceptionFilter());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
      queue: 'events',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();

  const port = config.get<number>('APP_PORT', 3000);

  app.use(helmet());

  await app
    .listen(port)
    .then(() => {
      console.info(`Application running on port ${port}`);
    })
    .catch((error) => {
      console.error('Error to start application', error);
    });
}

bootstrap();
