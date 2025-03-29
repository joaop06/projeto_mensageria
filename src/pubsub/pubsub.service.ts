import { config } from 'dotenv';
import { PubSub } from '@google-cloud/pubsub';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumeReservationMessageUseCase } from '../reservations/use-cases/consume-reservation-message.use-case';
import { ConsumeReservationMessageDto } from 'src/reservations/dto/consume-reservation-message.dto';

config();
const configService = new ConfigService();

const ENABLE_MESSAGE_ACKNOWLEDGMENT = configService.get('ENABLE_MESSAGE_ACKNOWLEDGMENT');

const GCP_PROJECT_ID = configService.get('GCP_PROJECT_ID');
const GCP_PUBSUB_TOPIC = configService.get('GCP_PUBSUB_TOPIC');
const GCP_PUBSUB_SUBSCRIPTION = configService.get('GCP_PUBSUB_SUBSCRIPTION');
const GOOGLE_APPLICATION_CREDENTIALS = configService.get('GOOGLE_APPLICATION_CREDENTIALS');

@Injectable()
export class PubSubService implements OnModuleInit {

    private pubSubClient: PubSub;

    constructor(
        private readonly consumeReservationMessageUseCase: ConsumeReservationMessageUseCase,
    ) { }

    async onModuleInit() {
        this.pubSubClient = new PubSub({
            projectId: GCP_PROJECT_ID,
            keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
        });

        this.subscribeMessage(GCP_PUBSUB_SUBSCRIPTION);
    }

    async subscribeMessage(subscriptionName: string) {
        const logger = new Logger('SubscribeReservation');

        const subscription = this.pubSubClient.subscription(subscriptionName);

        subscription.on('message', async (message) => {
            try {
                logger.log(`📥 Received message data: ${message.data.toString()}`);

                const reservationData = JSON.parse(message.data.toString());
                const reservation = await this.consumeReservationMessageUseCase.execute(reservationData);

                // Confirma que a mensagem foi processada
                if (ENABLE_MESSAGE_ACKNOWLEDGMENT === 'true') message.ack();

                logger.log(
                    'Reservation processed successfully',
                    JSON.stringify(reservation),
                );
            } catch (e) {
                logger.error('Error processing reservation:', e);
                if (ENABLE_MESSAGE_ACKNOWLEDGMENT === 'true') message.nack();
            }
        });

        subscription.on('error', (error) => {
            logger.error('Error processing reservation:', error);
        });
    }

    async publishMessage(topicName: string, data: any) {
        const logger = new Logger('PublishReservation');

        try {
            const dataBuffer = Buffer.from(JSON.stringify(data));
            const messageId = await this.pubSubClient
                .topic(topicName)
                .publishMessage({ data: dataBuffer });

            logger.log(`Message ${messageId} published to topic ${topicName}`);
            return messageId;

        } catch (e) {
            logger.error('Error publishing reservation message:', e);
        }
    }
}
