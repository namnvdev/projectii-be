import { IsNumber, IsDate } from 'class-validator';

export class CreateOrdersDto {
  @IsNumber()
  orderNumber: number;

  @IsDate()
  orderDate: Date;

  @IsDate()
  createdAt: Date;
}

