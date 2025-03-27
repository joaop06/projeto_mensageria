import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservedRoom } from '../entities/reserved-room.entity';
import { CreateReservedRoomDto } from '../dto/create-reserved-room.dto';

@Injectable()
export class CreateReservedRoomUseCase {
  constructor(
    @InjectRepository(ReservedRoom)
    private readonly repository: Repository<ReservedRoom>,
  ) {}

  async execute(object: CreateReservedRoomDto): Promise<ReservedRoom> {
    const reservation = this.repository.create(object);
    return await this.repository.save(reservation);
  }
}
