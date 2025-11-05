import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { CreateUsersDto } from './dto/create-userss.dto';
import { UpdateUsersDto } from './dto/update-userss.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private readonly repo: Repository<Users>) {}

  create(dto: CreateUsersDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const rec = await this.repo.findOne({ where: { id } });
    if (!rec) throw new NotFoundException('Users not found');
    return rec;
  }

  async update(id: number, dto: UpdateUsersDto) {
    const rec = await this.findOne(id);
    Object.assign(rec, dto);
    return this.repo.save(rec);
  }

  async remove(id: number) {
    const rec = await this.findOne(id);
    return this.repo.remove(rec);
  }
}

