import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id', type: 'int' })
  customer_id: number;

  @ManyToOne(() => Customer, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'order_number', type: 'varchar', length: 50 })
  order_number: string;

  @Column({ name: 'order_date', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  order_date: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['Pending', 'Paid', 'Shipped', 'Canceled'],
    default: 'Pending',
  })
  status: 'Pending' | 'Paid' | 'Shipped' | 'Canceled';

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_amount: number;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  created_by?: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
