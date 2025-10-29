import { Expose, Type } from 'class-transformer';
import { Customer } from '../../customers/entities/customer.entity';

export class OrderResponseDto {
  @Expose() id: number;
  @Expose() order_number: string;
  @Expose() order_date: Date;
  @Expose() status: string;
  @Expose() total_amount: number;
  @Expose() customer_id: number;
  @Expose() created_by: number;
  @Expose() created_at: Date;

  @Expose()
  @Type(() => Customer)
  customer?: Customer;
}
