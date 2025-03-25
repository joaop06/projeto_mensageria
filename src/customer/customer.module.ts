import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CustomerController } from './customer.controller';

@Module({
  exports: [CustomerService],
  providers: [CustomerService],
  controllers: [CustomerController],
  imports: [TypeOrmModule.forFeature([Customer])]
})
export class CustomerModule { }
