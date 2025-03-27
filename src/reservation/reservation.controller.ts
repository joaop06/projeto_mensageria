import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.entity';

@Controller('reserves')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Get()
  async findAll(
    @Query('uuid') uuid?: string,
    @Query('customerId') customerId?: number,
    @Query('roomId') roomId?: number,
  ): Promise<Reservation[]> {
    return await this.reservationService.findAll(uuid, customerId, roomId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Reservation | null> {
    return await this.reservationService.findById(id);
  }

  // @Post()
  // async publishMessageToReserve(@Ctx() context: RmqContext) {
  //   const channel = context.getChannelRef();

  //   const message = require('../../../message.json');
  //   return await channel.sendToQueue('reservation_queue', Buffer.from(JSON.stringify(message)));
  // }
}
