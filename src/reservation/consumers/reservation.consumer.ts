import { ReservationService } from '../reservation.service';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ReservationConsumer implements OnModuleInit {
    private client: ClientProxy;

    private logger = new Logger('ReservationConsumer');

    constructor(
        @Inject(ReservationService)
        private reservationService: ReservationService,
    ) {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://localhost:5672'], // URL do seu RabbitMQ
                queue: 'reservation_queue',
                queueOptions: {
                    durable: true // Fila durável sobrevive a reinicializações do servidor
                },
            },
        });
    }

    async onModuleInit() {
        try {
            await this.client.connect();

            // Padrão recomendado para consumir mensagens continuamente
            this.client
                .emit('reservation_created', {}) // Pode ser usado para trigger inicial
                .subscribe();

            // Ou usando um padrão de assinatura
            await this.client.send('reservation_queue', {}).subscribe({
                next: async (message) => {
                    console.log('Mensagem recebida:', message);
                    try {
                        await this.reservationService.createReservation(message);
                        // Confirmação de entrega (ack) implícita no NestJS
                    } catch (err) {
                        console.error('Erro ao processar reserva:', err);
                        // Aqui você poderia implementar DLQ (Dead Letter Queue)
                    }
                },
                error: (err) => console.error('Erro na conexão:', err),
            });

        } catch (e) {
            this.logger.error(e);
        }
    }

    async onApplicationShutdown() {
        await this.client.close();
    }
}
