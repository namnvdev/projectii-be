import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "../../orders/entities/order.entity";
import { Product } from "../../products/entities/product.entity";

@Index("product_id", ["productId"], {})
@Index("order_id", ["orderId"], {})
@Entity("order_details", { schema: "sms_demo" })
export class OrderDetail {
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

  @ManyToOne(() => Order, (order) => order.orderDetails, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "order_id", referencedColumnName: "id" }])
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderDetails, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "product_id", referencedColumnName: "id" }])
  product: Product;
}
