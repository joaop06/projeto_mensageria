import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { CustomerModule } from '../customer/customer.module';
import { ReservedRoom } from './entities/reserved-room.entity';
import { Customer } from '../customer/entities/customer.entity';
import { ReservationController } from './reservation.controller';
import { CreateReservationUseCase } from './use-cases/create-reservation.use-case';
import { CreateReservedRoomUseCase } from './use-cases/create-reserved-room.use-case';
import { CreateCustomerUseCase } from '../customer/use-cases/create-customer.use-case';
import { ConsumeReservationMessageUseCase } from './use-cases/consume-reservation-message.use-case';

@Global()
@Module({
  controllers: [ReservationController],
  imports: [
    CustomerModule,
    TypeOrmModule.forFeature([Reservation, ReservedRoom, Customer]),
  ],
  exports: [
    ReservationService,
    CreateReservationUseCase,
    CreateReservedRoomUseCase,
    ConsumeReservationMessageUseCase,
  ],
  providers: [
    ReservationService,
    CreateCustomerUseCase,
    CreateReservationUseCase,
    CreateReservedRoomUseCase,
    ConsumeReservationMessageUseCase,
  ],
})
export class ReservationModule { }
