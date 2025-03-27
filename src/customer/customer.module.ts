import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerUseCase } from './use-cases/create-customer.use-case';

@Module({
  exports: [CreateCustomerUseCase],
  providers: [CreateCustomerUseCase],
  imports: [TypeOrmModule.forFeature([Customer])],
})
export class CustomerModule {}
