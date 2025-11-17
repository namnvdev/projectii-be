import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Customer } from "../../customers/entities/customer.entity";
import { OrderDetail } from "../../orderdetails/entities/orderdetail.entity";

@Entity("orders", { schema: "sms_demo" })
export class Order {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "order_number", length: 50 })
  orderNumber: string;

  @Column({
    name: "status",
    type: "enum",
    enum: ["Pending", "Paid", "Shipped", "Canceled"],
    default: "Pending",
  })
  status: "Pending" | "Paid" | "Shipped" | "Canceled";

  @Column("decimal", {
    name: "total_amount",
    precision: 10,
    scale: 2,
    default: () => "0.00",
  })
  totalAmount: string;

  @Column("int", { name: "created_by", nullable: true })
  createdBy: number | null;

  @Column("datetime", {
    name: "order_date",
    default: () => "CURRENT_TIMESTAMP",
  })
  orderDate: Date;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "customer_id", referencedColumnName: "id" }])
  customer: Customer;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];
}
