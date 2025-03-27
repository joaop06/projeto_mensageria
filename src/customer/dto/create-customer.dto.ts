import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
