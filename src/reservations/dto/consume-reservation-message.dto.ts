import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConsumeReservationMessageDto {
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @Transform(() => Date)
  @IsDate()
  created_at: Date;

  @IsNotEmpty()
  @Transform(() => CustomerMessage)
  customer: CustomerMessage;

  @IsNotEmpty()
  rooms: RoomsMessage[];
}

class CustomerMessage {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}

class RoomsMessage {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  daily_rate: number;

  @IsNotEmpty()
  @IsNumber()
  number_of_days: number;

  @IsNotEmpty()
  @Transform(() => Date)
  @IsDate()
  reservation_date: Date;

  @IsNotEmpty()
  @Transform(() => RoomCategoryMessage)
  category: RoomCategoryMessage;
}

class RoomCategoryMessage {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @Transform(() => RoomSubCategoryMessage)
  sub_category: RoomSubCategoryMessage;
}

class RoomSubCategoryMessage {
  @IsString()
  @IsNotEmpty()
  id: string;
}
