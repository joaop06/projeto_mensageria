import { Controller, Get, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';

@Controller('reserves')
export class ReservationController {
  constructor(private reservationService: ReservationService) { }

  @Get()
  async getReservations(
    @Query('uuid') uuid?: string,
    @Query('customerId') customerId?: number,
    @Query('roomId') roomId?: number,
  ) {
    return await this.reservationService.getReservations(uuid, customerId, roomId);
  }
}
