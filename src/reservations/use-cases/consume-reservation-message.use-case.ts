import { Inject, Injectable } from '@nestjs/common';
import { ReservationService } from '../reservation.service';
import { Reservation } from '../entities/reservation.entity';
import { CreateReservationUseCase } from './create-reservation.use-case';
import { CreateReservedRoomUseCase } from './create-reserved-room.use-case';
import { CreateCustomerUseCase } from '../../customer/use-cases/create-customer.use-case';
import { ConsumeReservationMessageDto } from '../dto/consume-reservation-message.dto';

@Injectable()
export class ConsumeReservationMessageUseCase {
  constructor(
    @Inject(ReservationService)
    private reservationService: ReservationService,

    @Inject(CreateCustomerUseCase)
    private createCustomerUseCase: CreateCustomerUseCase,

    @Inject(CreateReservationUseCase)
    private createReservationUseCase: CreateReservationUseCase,

    @Inject(CreateReservedRoomUseCase)
    private createReservedRoomUseCase: CreateReservedRoomUseCase,
  ) {}

  async execute(data: ConsumeReservationMessageDto): Promise<Reservation> {
    // Verifica se o cliente já existe ou cria um novo
    const customer = await this.createCustomerUseCase.execute(data.customer);

    // Cria a reserva
    const reservation = await this.createReservationUseCase.execute({
      uuid: data.uuid,
      type: data.type,
      customerId: customer.id,
      createdAt: data.created_at,
      customerName: customer.name,
    });

    // Cria os quartos vinculados à reserva
    for (const room of data.rooms) {
      await this.createReservedRoomUseCase.execute({
        reservation,
        dailyRate: room.daily_rate,
        categoryId: room.category.id,
        numberOfDays: room.number_of_days,
        reservationDate: room.reservation_date,
        subCategoryId: room.category.sub_category.id,
      });
    }

    const newReservation = await this.reservationService.findById(
      reservation.id,
    );
    return newReservation as Reservation;
  }
}
