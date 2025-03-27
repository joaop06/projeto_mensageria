import * as amqp from 'amqplib';
import { Channel, ChannelModel } from 'amqplib';
import { ReservationService } from '../reservation.service';
import { Inject, Injectable, Logger, MiddlewareConsumer, NestModule, OnModuleInit } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Injectable()
export class ReservationConsumer implements OnModuleInit {
    private channel: Channel;

    private connection: ChannelModel;

    private logger = new Logger('ReservationConsumer');

    private RESERVATION_QUEUE_NAME = 'reservation_queue';

    constructor(
        @Inject(ReservationService)
        private reservationService: ReservationService,
    ) { }

    async onModuleInit() {
        this.connection = await amqp.connect('amqp://localhost');
        this.channel = await this.connection.createChannel();

        this.handleReservationCreated();
    }

    async handleReservationCreated(): Promise<void> {
        await this.channel.assertQueue(this.RESERVATION_QUEUE_NAME);

        this.channel.consume(this.RESERVATION_QUEUE_NAME, async (msg) => {
            if (msg === null) return;

            try {
                const { content } = msg;
                const { data } = JSON.parse(content.toString());

                this.logger.log(`📥 Received message: ${data}`);

                await this.reservationService.createReservation(data);

                // Confirma processamento da mensagem
                this.channel.ack(msg);

                this.logger.log('Reservation processed successfully');
            } catch (err) {
                this.logger.error('Error processing reservation:', err);

                // Em caso de erro, rejeita a mensagem
                // Pode ser configurado para enviar para DLQ
                this.channel.nack(msg, false, false);
            }
        });
    }



    // // @MessagePattern('reservation_queue')
    // @EventPattern('reservation_queue')
    // async handleReservationCreated(
    //     @Payload() data: unknown,
    //     @Ctx() context: RmqContext
    // ) {
    //     const channel = context.getChannelRef();
    //     const originalMessage = context.getMessage();

    //     try {
    //         this.logger.log(`Mensagem recebida: ${JSON.stringify(data)}`);

    //         await this.reservationService.createReservation(data);

    //         // Confirma processamento da mensagem
    //         channel.ack(originalMessage);

    //         this.logger.log('Reserva processada com sucesso.');
    //     } catch (err) {
    //         this.logger.error('Erro ao processar reserva:', err);

    //         // Em caso de erro, rejeita a mensagem
    //         // Pode ser configurado para enviar para DLQ
    //         channel.nack(originalMessage, false, false);
    //     }
    // }
}
