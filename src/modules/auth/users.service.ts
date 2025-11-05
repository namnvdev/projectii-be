import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  create(dto: CreateUserDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const rec = await this.repo.findOne({ where: { id } });
    if (!rec) throw new NotFoundException('User not found');
    return rec;
  }

  async update(id: number, dto: UpdateUserDto) {
    const rec = await this.findOne(id);
    Object.assign(rec, dto);
    return this.repo.save(rec);
  }

  async remove(id: number) {
    const rec = await this.findOne(id);
    return this.repo.remove(rec);
  }
}

