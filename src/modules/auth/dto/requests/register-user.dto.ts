import { IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  role?: string; // optional, defaults to 'user'
}
