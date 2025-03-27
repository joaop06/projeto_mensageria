import * as amqp from 'amqplib';
import { Channel, ChannelModel } from 'amqplib';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumeReservationMessageDto } from '../dto/consume-reservation-message.dto';
import { ConsumeReservationMessageUseCase } from '../use-cases/consume-reservation-message.use-case';

@Injectable()
export class ReservationConsumer implements OnModuleInit {
  private channel: Channel;

  private connection: ChannelModel;

  private logger = new Logger('ReservationConsumer');

  private RESERVATION_QUEUE_NAME = 'reservation_queue';

  constructor(
    @Inject(ConsumeReservationMessageUseCase)
    private consumeReservationMessageUseCase: ConsumeReservationMessageUseCase,
  ) {}

  async onModuleInit() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();

    await this.handleReservationCreated();
  }

  async handleReservationCreated(): Promise<void> {
    await this.channel.assertQueue(this.RESERVATION_QUEUE_NAME);

    await this.channel.consume(
      this.RESERVATION_QUEUE_NAME,
      async (msg): Promise<void> => {
        // eslint-disable-line
        if (msg === null) return;

        try {
          const { content } = msg;
          const { data } = JSON.parse(content.toString()); // eslint-disable-line

          this.logger.log(`📥 Received message: ${data}`);

          const reservation =
            await this.consumeReservationMessageUseCase.execute(
              data as ConsumeReservationMessageDto,
            );

          // Confirma processamento da mensagem
          this.channel.ack(msg);

          this.logger.log(
            'Reservation processed successfully',
            JSON.stringify(reservation),
          );
        } catch (err) {
          this.logger.error('Error processing reservation:', err);

          // Em caso de erro, rejeita a mensagem
          // Pode ser configurado para enviar para DLQ
          this.channel.nack(msg, false, false);
        }
      },
    );
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
