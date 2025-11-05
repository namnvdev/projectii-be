import { PartialType } from '@nestjs/swagger';
import { CreateOrderDetailsDto } from './create-order-detailss.dto';

export class UpdateOrderDetailsDto extends PartialType(CreateOrderDetailsDto) {}

