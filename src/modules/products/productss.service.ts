import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './entities/products.entity';
import { CreateProductsDto } from './dto/create-productss.dto';
import { UpdateProductsDto } from './dto/update-productss.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Products) private readonly repo: Repository<Products>) {}

  create(dto: CreateProductsDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const rec = await this.repo.findOne({ where: { id } });
    if (!rec) throw new NotFoundException('Products not found');
    return rec;
  }

  async update(id: number, dto: UpdateProductsDto) {
    const rec = await this.findOne(id);
    Object.assign(rec, dto);
    return this.repo.save(rec);
  }

  async remove(id: number) {
    const rec = await this.findOne(id);
    return this.repo.remove(rec);
  }
}

