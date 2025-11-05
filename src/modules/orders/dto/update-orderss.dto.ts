import { PartialType } from '@nestjs/swagger';
import { CreateOrdersDto } from './create-orderss.dto';

export class UpdateOrdersDto extends PartialType(CreateOrdersDto) {}

