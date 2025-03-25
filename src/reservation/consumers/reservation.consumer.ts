import { Injectable } from '@nestjs/common';
import { ReservationService } from '../reservation.service';

@Injectable()
export class ReservationConsumer {
    constructor(private reservationService: ReservationService) { }

    async consumeMessage(message: any) {
        console.log('Message received:', message);
        await this.reservationService.createReservation(message);
    }
}
