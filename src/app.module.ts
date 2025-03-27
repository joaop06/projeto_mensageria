import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { CustomerModule } from './customer/customer.module';
import { ReservationModule } from './reservations/reservation.module';

@Module({
  imports: [
    CustomerModule,
    ReservationModule,
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
})
export class AppModule { }
