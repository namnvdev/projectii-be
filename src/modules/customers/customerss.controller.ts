import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomersService } from './customerss.service';
import { CreateCustomersDto } from './dto/create-customerss.dto';
import { UpdateCustomersDto } from './dto/update-customerss.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Customers')
@Controller('customerss')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Post()
  @Auth('user')
  create(@Body() dto: CreateCustomersDto) {
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
  update(@Param('id') id: number, @Body() dto: UpdateCustomersDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}

