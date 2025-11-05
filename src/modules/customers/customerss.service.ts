import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customers } from './entities/customers.entity';
import { CreateCustomersDto } from './dto/create-customerss.dto';
import { UpdateCustomersDto } from './dto/update-customerss.dto';

@Injectable()
export class CustomersService {
  constructor(@InjectRepository(Customers) private readonly repo: Repository<Customers>) {}

  create(dto: CreateCustomersDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const rec = await this.repo.findOne({ where: { id } });
    if (!rec) throw new NotFoundException('Customers not found');
    return rec;
  }

  async update(id: number, dto: UpdateCustomersDto) {
    const rec = await this.findOne(id);
    Object.assign(rec, dto);
    return this.repo.save(rec);
  }

  async remove(id: number) {
    const rec = await this.findOne(id);
    return this.repo.remove(rec);
  }
}

