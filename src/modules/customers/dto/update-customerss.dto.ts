import { PartialType } from '@nestjs/swagger';
import { CreateCustomersDto } from './create-customerss.dto';

export class UpdateCustomersDto extends PartialType(CreateCustomersDto) {}

