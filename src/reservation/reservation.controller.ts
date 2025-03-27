import { Ctx, RmqContext } from '@nestjs/microservices';
import { ReservationService } from './reservation.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

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

  @Post()
  async publishMessageToReserve(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();

    const message = require('../../../message.json');
    return await channel.sendToQueue('reservation_queue', Buffer.from(JSON.stringify(message)));
  }
}
