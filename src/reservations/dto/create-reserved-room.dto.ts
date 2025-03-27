import { Transform } from 'class-transformer';
import { Reservation } from '../entities/reservation.entity';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReservedRoomDto {
  @IsNotEmpty()
  @IsNumber()
  dailyRate: number;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsNumber()
  numberOfDays: number;

  @IsNotEmpty()
  @Transform(() => Date)
  @IsDate()
  reservationDate: Date;

  @IsNotEmpty()
  @IsString()
  subCategoryId: string;

  @IsNotEmpty()
  @Transform(() => Reservation)
  reservation: Reservation;
}
