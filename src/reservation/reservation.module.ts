import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { ReservedRoom } from './entities/reserved-room.entity';
import { Customer } from '../customer/entities/customer.entity';
import { ReservationController } from './reservation.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReservationConsumer } from './consumers/reservation.consumer';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService, ReservationConsumer],
  imports: [
    TypeOrmModule.forFeature([Reservation, ReservedRoom, Customer]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          queue: 'reservation_queue',
          urls: ['amqp://localhost:5672'],
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ]
})
export class ReservationModule { }
