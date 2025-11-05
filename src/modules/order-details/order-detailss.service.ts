import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetails } from './entities/order-details.entity';
import { CreateOrderDetailsDto } from './dto/create-order-detailss.dto';
import { UpdateOrderDetailsDto } from './dto/update-order-detailss.dto';

@Injectable()
export class OrderDetailsService {
  constructor(@InjectRepository(OrderDetails) private readonly repo: Repository<OrderDetails>) {}

  create(dto: CreateOrderDetailsDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const rec = await this.repo.findOne({ where: { id } });
    if (!rec) throw new NotFoundException('OrderDetails not found');
    return rec;
  }

  async update(id: number, dto: UpdateOrderDetailsDto) {
    const rec = await this.findOne(id);
    Object.assign(rec, dto);
    return this.repo.save(rec);
  }

  async remove(id: number) {
    const rec = await this.findOne(id);
    return this.repo.remove(rec);
  }
}

