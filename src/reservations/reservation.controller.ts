import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReservationNotFoundException } from './exceptions/reservation-not-found.exception';

@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) { }

  @Get()
  async findAll(
    @Query('uuid') uuid?: string,
    @Query('customerId') customerId?: number,
    @Query('roomId') roomId?: number,
  ): Promise<Reservation[]> {
    return await this.reservationService.findAll(uuid, customerId, roomId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Reservation> {
    const reservation = await this.reservationService.findById(id);

    if (!reservation) throw new ReservationNotFoundException();

    return reservation;
  }
}
