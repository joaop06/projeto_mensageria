import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @InjectRepository(Customer)
    private readonly repository: Repository<Customer>,
  ) {}

  async execute(object: CreateCustomerDto): Promise<Customer> {
    let customer = await this.repository.findOneBy({
      id: object.id,
    });

    if (customer) return customer;

    customer = this.repository.create({
      id: object.id,
      name: object.name,
    });

    return await this.repository.save(customer);
  }
}
