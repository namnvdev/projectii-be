import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Orders } from "./orders";

@Index("IDX_8536b8b85c06969f84f0c098b0", ["email"], { unique: true })
@Entity("customers", { schema: "sms_demo" })
export class Customers {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @Column("varchar", { name: "email", unique: true, length: 100 })
  email: string;

  @Column("varchar", { name: "phone", nullable: true, length: 20 })
  phone: string | null;

  @Column("varchar", { name: "address", length: 255 })
  address: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "'current_timestamp(6)'",
  })
  createdAt: Date;

  @Column("datetime", {
    name: "updated_at",
    default: () => "'current_timestamp(6)'",
  })
  updatedAt: Date;

  @OneToMany(() => Orders, (orders) => orders.customer)
  orders: Orders[];
}
