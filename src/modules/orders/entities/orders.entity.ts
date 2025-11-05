import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Customers } from "../../customers/entities/customers.entity";
import { OrderDetails } from "../../order-details/entities/order-details.entity";

@Entity("orders", { schema: "sms_demo" })
export class Orders {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "order_number", length: 50 })
  orderNumber: string;

  @Column("enum", {
    name: "status",
    enum: ["Pending", "Paid", "Shipped", "Canceled"],
    default: () => "'Pending'",
  })
  status: "Pending" | "Paid" | "Shipped" | "Canceled";

  @Column("decimal", {
    name: "total_amount",
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
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
    default: () => "'current_timestamp(6)'",
  })
  createdAt: Date;

  @ManyToOne(() => Customers, (customers) => customers.orders, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "customer_id", referencedColumnName: "id" }])
  customer: Customers;

  @OneToMany(() => OrderDetails, (orderDetails) => orderDetails.order)
  orderDetails: OrderDetails[];
}
