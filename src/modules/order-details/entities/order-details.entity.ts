import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Orders } from "../../orders/entities/orders.entity";
import { Products } from "../../products/entities/products.entity";

@Index("order_id", ["orderId"], {})
@Index("product_id", ["productId"], {})
@Entity("order_details", { schema: "sms_demo" })
export class OrderDetails {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "order_id" })
  orderId: number;

  @Column("int", { name: "product_id" })
  productId: number;

  @Column("int", { name: "quantity" })
  quantity: number;

  @Column("decimal", { name: "price", precision: 10, scale: 2 })
  price: string;

  @ManyToOne(() => Orders, (orders) => orders.orderDetails, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "order_id", referencedColumnName: "id" }])
  order: Orders;

  @ManyToOne(() => Products, (products) => products.orderDetails, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Products;
}
