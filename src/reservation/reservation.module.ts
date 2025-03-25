import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { ReservedRoom } from './entities/reserved-room.entity';
import { Customer } from '../customer/entities/customer.entity';
import { ReservationController } from './reservation.controller';

@Module({
  providers: [ReservationService],
  controllers: [ReservationController],
  imports: [TypeOrmModule.forFeature([Reservation, ReservedRoom, Customer])]
})
export class ReservationModule { }
