import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderDetailsService } from './order-detailss.service';
import { CreateOrderDetailsDto } from './dto/create-order-detailss.dto';
import { UpdateOrderDetailsDto } from './dto/update-order-detailss.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('OrderDetails')
@Controller('order-detailss')
export class OrderDetailsController {
  constructor(private readonly service: OrderDetailsService) {}

  @Post()
  @Auth('user')
  create(@Body() dto: CreateOrderDetailsDto) {
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
  update(@Param('id') id: number, @Body() dto: UpdateOrderDetailsDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}

