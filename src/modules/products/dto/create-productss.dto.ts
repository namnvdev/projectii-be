import { IsString, IsNumber } from 'class-validator';

export class CreateProductsDto {
  @IsString()
  name: string;

  @IsString()
  price: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;
}

