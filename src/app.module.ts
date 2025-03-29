import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PubsubModule } from './pubsub/pubsub.module';
import { typeOrmConfig } from '../config/typeorm.config';
import { CustomerModule } from './customer/customer.module';
import { ReservationModule } from './reservations/reservation.module';

@Module({
  imports: [
    PubsubModule,
    CustomerModule,
    ReservationModule,
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
})
export class AppModule { }
