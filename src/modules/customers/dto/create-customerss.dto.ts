import { IsString, IsDate } from 'class-validator';

export class CreateCustomersDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  address: string;

  @IsString()
  address: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

