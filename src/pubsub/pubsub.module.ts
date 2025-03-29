import { Module } from '@nestjs/common';
import { PubSubService } from './pubsub.service';

@Module({
  exports: [PubSubService],
  providers: [PubSubService],
})
export class PubsubModule { }
