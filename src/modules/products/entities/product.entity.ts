import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderDetail } from "../../orderdetails/entities/orderdetail.entity";

@Index("sku", ["sku"], { unique: true })
@Index("IDX_c44ac33a05b144dd0d9ddcf932", ["sku"], { unique: true })
@Entity("products", { schema: "sms_demo" })
export class Product {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("varchar", { name: "sku", nullable: true, unique: true, length: 50 })
  sku: string | null;

  @Column("varchar", { name: "brand", nullable: true, length: 50 })
  brand: string | null;

  @Column("decimal", { name: "price", precision: 10, scale: 2 })
  price: string;

  @Column("int", { name: "stock" })
  stock: number;

  @Column("varchar", { name: "category", nullable: true, length: 50 })
  category: string | null;

  @Column("longtext", { name: "attributes", nullable: true })
  attributes: string | null;

  @Column("varchar", { name: "image_url", nullable: true, length: 255 })
  imageUrl: string | null;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("datetime", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetails: OrderDetail[];
}
