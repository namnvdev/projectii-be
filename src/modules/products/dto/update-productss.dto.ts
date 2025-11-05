import { PartialType } from '@nestjs/swagger';
import { CreateProductsDto } from './create-productss.dto';

export class UpdateProductsDto extends PartialType(CreateProductsDto) {}

