import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  customer_id: number;

  @IsString()
  order_number: string;

  @IsOptional()
  @IsEnum(['Pending', 'Paid', 'Shipped', 'Canceled'])
  status?: 'Pending' | 'Paid' | 'Shipped' | 'Canceled';

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total_amount: number;

  @IsOptional()
  @IsInt()
  created_by?: number;
}
