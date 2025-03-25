import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservedRoom } from './entities/reserved-room.entity';
import { Customer } from '../customer/entities/customer.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(ReservedRoom)
    private roomRepository: Repository<ReservedRoom>,

    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) { }

  async createReservation(data: any) {
    // Verifica se o cliente já existe para evitar duplicação
    let customer = await this.customerRepository.findOneBy({
      id: data.customer.id,
    });

    if (!customer) {
      customer = this.customerRepository.create({
        id: data.customer.id,
        name: data.customer.name,
      });

      await this.customerRepository.save(customer);
    }

    // Cria a reserva
    const reservation = this.reservationRepository.create({
      uuid: data.uuid,
      type: data.type,
      createdAt: data.created_at,
      customerId: data.customer.id,
      customerName: data.customer.name,
    });

    await this.reservationRepository.save(reservation);

    for (const room of data.rooms) {
      const reservedRoom = this.roomRepository.create({
        dailyRate: room.daily_rate,
        numberOfDays: room.number_of_days,
        reservationDate: room.reservation_date,
        categoryId: room.category.id,
        subCategoryId: room.category.sub_category.id,
        reservation,
      });
      await this.roomRepository.save(reservedRoom);
    }
  }

  async getReservations(uuid?: string, customerId?: number, roomId?: number) {
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

    const reservations = await query.getMany();

    return reservations.map((res) => ({
      uuid: res.uuid,
      type: res.type,
      createdAt: res.createdAt,
      customer: {
        id: res.customerId,
        name: res.customerName,
      },
      rooms: res.rooms.map((room) => ({
        id: room.id,
        dailyRate: room.dailyRate,
        numberOfDays: room.numberOfDays,
        reservationDate: room.reservationDate,
        category: {
          id: room.categoryId,
          subCategory: {
            id: room.subCategoryId,
          },
        },
      })),
    }));
  }
}
