import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { OrderdetailService } from './orderdetail.service';

@Controller('orderdetails')
export class OrderdetailController {
  constructor(private service: OrderdetailService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }
}