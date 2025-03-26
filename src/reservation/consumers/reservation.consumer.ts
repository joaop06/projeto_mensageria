import { ReservationService } from '../reservation.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Injectable()
export class ReservationConsumer {
    private logger = new Logger('ReservationConsumer');

    constructor(
        @Inject(ReservationService)
        private reservationService: ReservationService,
    ) { }

    // @MessagePattern('reservation_queue')
    @EventPattern('reservation_queue')
    async handleReservationCreated(
        @Payload() data: unknown,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef();
        const originalMessage = context.getMessage();

        try {
            this.logger.log(`Mensagem recebida: ${JSON.stringify(data)}`);

            await this.reservationService.createReservation(data);

            // Confirma processamento da mensagem
            channel.ack(originalMessage);

            this.logger.log('Reserva processada com sucesso.');
        } catch (err) {
            this.logger.error('Erro ao processar reserva:', err);

            // Em caso de erro, rejeita a mensagem
            // Pode ser configurado para enviar para DLQ
            channel.nack(originalMessage, false, false);
        }
    }
}
