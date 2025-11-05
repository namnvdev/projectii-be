import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @Auth('user')
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get()
  @Auth('user')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Auth('user')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Auth('user')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}

