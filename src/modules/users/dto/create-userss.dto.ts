import { IsString, IsDate } from 'class-validator';

export class CreateUsersDto {
  @IsString()
  passwordHash: string;

  @IsDate()
  created: Date;

  @IsString()
  username: string;

  @IsString()
  role: string;
}

