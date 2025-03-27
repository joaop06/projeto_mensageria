import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async findById(id: number): Promise<Reservation | null> {
    return await this.reservationRepository.findOne({
      where: { id },
      relations: {
        rooms: true,
        customer: true,
      },
    });
  }

  async findAll(
    uuid?: string,
    customerId?: number,
    roomId?: number,
  ): Promise<Reservation[]> {
    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.rooms', 'room');

    if (uuid) {
      query.andWhere('reservation.uuid = :uuid', { uuid });
    }

    if (customerId) {
      query.andWhere('reservation.customerId = :customerId', { customerId });
    }

    if (roomId) {
      query.andWhere('room.id = :roomId', { roomId });
    }

    return await query.getMany();
  }
}
