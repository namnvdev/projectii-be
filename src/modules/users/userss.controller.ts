import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './userss.service';
import { CreateUsersDto } from './dto/create-userss.dto';
import { UpdateUsersDto } from './dto/update-userss.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Users')
@Controller('userss')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @Auth('user')
  create(@Body() dto: CreateUsersDto) {
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
  update(@Param('id') id: number, @Body() dto: UpdateUsersDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}

