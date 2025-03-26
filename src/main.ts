import * as amqp from 'amqplib';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(process.env.PORT ?? 3000);



  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  // Verifica se a fila já existe antes de tentar recriá-la
  try {
    await channel.checkQueue('reservation_queue');

    // Se a fila existe, fecha a conexão atual
    await channel.close();
    await connection.close();
  } catch (error) {
    // Fila não existe, então podemos criar normalmente
    await channel.assertQueue('reservation_queue', {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'dlx_reservation',
        'x-dead-letter-routing-key': 'reservation_dlq'
      }
    });
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost'],
      queue: 'reservation_queue',
      queueOptions: {
        durable: true
      },
      noAck: false,
      prefetchCount: 1, // Processa uma mensagem por vez
    },
  });

  await app.listen();
  console.log('Microserviço RabbitMQ iniciado');
}
bootstrap();
