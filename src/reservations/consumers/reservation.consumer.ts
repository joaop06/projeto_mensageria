import { config } from 'dotenv';
import { PubSub } from '@google-cloud/pubsub';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumeReservationMessageDto } from '../dto/consume-reservation-message.dto';
import { ConsumeReservationMessageUseCase } from '../use-cases/consume-reservation-message.use-case';

config();
const configService = new ConfigService();

const GCP_PROJECT_ID = configService.get('GCP_PROJECT_ID');
const PUBSUB_TOPIC_NAME = configService.get('PUBSUB_TOPIC_NAME');
const PUBSUB_SUBSCRIPTION_NAME = configService.get('PUBSUB_SUBSCRIPTION_NAME');
const GOOGLE_APPLICATION_CREDENTIALS = configService.get('GOOGLE_APPLICATION_CREDENTIALS');

@Injectable()
export class ReservationConsumer implements OnModuleInit {

  private logger = new Logger('ReservationConsumer');

  private RESERVATION_QUEUE_NAME = 'reservation_queue';


  private pubSubClient = new PubSub();
  private topicName = 'reservation-topic';
  private subscriptionName = 'reservation-sub';

  constructor(
    @Inject(ConsumeReservationMessageUseCase)
    private consumeReservationMessageUseCase: ConsumeReservationMessageUseCase,
  ) { }

  async onModuleInit() {
    await this.handleReservationCreated();
  }

  async handleReservationCreated(): Promise<void> {
    // Cria um tópico e subtópico se ainda não existir
    await this.ensureTopicAndSubscription();

    const subscription = this.pubSubClient.subscription(this.subscriptionName);
    const messageHandler = async (message: any) => {
      try {
        this.logger.log(`📥 Received message: ${message.data.toString()}`);

        const data = JSON.parse(message.data.toString());

        const reservation = await this.consumeReservationMessageUseCase.execute(
          data as ConsumeReservationMessageDto,
        );

        // Acknowledge the message
        // message.ack();

        this.logger.log(
          'Reservation processed successfully',
          JSON.stringify(reservation),
        );
      } catch (err) {
        this.logger.error('Error processing reservation:', err);

        // In case of error, don't acknowledge the message
        // It will be redelivered after the ack deadline
        // Alternatively, you could nack it: message.nack();
        // message.nack();
      }
    };

    subscription.on('message', messageHandler);

    this.logger.log(`🚀 Listening for messages on subscription ${this.subscriptionName}`);
  }

  private async ensureTopicAndSubscription(): Promise<void> {
    try {
      // Check if topic exists, create if not
      const [topics] = await this.pubSubClient.getTopics();
      const topicExists = topics.some(t => t.name.endsWith(this.topicName));

      if (!topicExists) {
        await this.pubSubClient.createTopic(this.topicName);
        this.logger.log(`Topic ${this.topicName} created`);
      }

      // Check if subscription exists, create if not
      const [subscriptions] = await this.pubSubClient.getSubscriptions();
      const subExists = subscriptions.some(s => s.name.endsWith(this.subscriptionName));

      if (!subExists) {
        await this.pubSubClient
          .topic(this.topicName)
          .createSubscription(this.subscriptionName);
        this.logger.log(`Subscription ${this.subscriptionName} created`);
      }
    } catch (err) {
      this.logger.error('Error ensuring topic/subscription exists:', err);
      throw err;
    }
  }
}
