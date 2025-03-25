import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {

  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) { }

  async findById(id: number): Promise<Customer | null> {
    return await this.customerRepository.findOneBy({ id });
  }

  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  findAll() {
    return `This action returns all customer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
