import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './entities/orderdetail.entity';
import { OrderdetailService } from './orderdetail.service';
import { OrderdetailController } from './orderdetail.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail])],
  controllers: [OrderdetailController],
  providers: [OrderdetailService],
})
export class OrderdetailModule {}