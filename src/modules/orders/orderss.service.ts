import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from './entities/orders.entity';
import { CreateOrdersDto } from './dto/create-orderss.dto';
import { UpdateOrdersDto } from './dto/update-orderss.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Orders) private readonly repo: Repository<Orders>) {}

  create(dto: CreateOrdersDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const rec = await this.repo.findOne({ where: { id } });
    if (!rec) throw new NotFoundException('Orders not found');
    return rec;
  }

  async update(id: number, dto: UpdateOrdersDto) {
    const rec = await this.findOne(id);
    Object.assign(rec, dto);
    return this.repo.save(rec);
  }

  async remove(id: number) {
    const rec = await this.findOne(id);
    return this.repo.remove(rec);
  }
}

