import { PartialType } from '@nestjs/swagger';
import { CreateUsersDto } from './create-userss.dto';

export class UpdateUsersDto extends PartialType(CreateUsersDto) {}

