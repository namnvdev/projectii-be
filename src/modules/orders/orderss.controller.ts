import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orderss.service';
import { CreateOrdersDto } from './dto/create-orderss.dto';
import { UpdateOrdersDto } from './dto/update-orderss.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Orders')
@Controller('orderss')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  @Auth('user')
  create(@Body() dto: CreateOrdersDto) {
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
  update(@Param('id') id: number, @Body() dto: UpdateOrdersDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}

