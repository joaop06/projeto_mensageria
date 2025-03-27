import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from '../entities/reservation.entity';
import { CreateReservationDto } from '../dto/create-reservation.dto';

@Injectable()
export class CreateReservationUseCase {
  constructor(
    @InjectRepository(Reservation)
    private readonly repository: Repository<Reservation>,
  ) {}

  async execute(object: CreateReservationDto): Promise<Reservation> {
    const reservation = this.repository.create(object);
    return await this.repository.save(reservation);
  }
}
