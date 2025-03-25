import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { CustomerModule } from './customer/customer.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    CustomerModule,
    ReservationModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ClientsModule.register([
      {
        name: 'RESERVATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'reservation_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
})
export class AppModule { }
