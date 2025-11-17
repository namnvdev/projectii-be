import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetail } from './entities/orderdetail.entity';

@Injectable()
export class OrderdetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private repo: Repository<OrderDetail>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: any) {
    return this.repo.save(this.repo.create(data));
  }
}