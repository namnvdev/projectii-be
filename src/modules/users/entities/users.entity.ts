import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("IDX_fe0bb3f6520ee0469504521e71", ["username"], { unique: true })
@Entity("users", { schema: "sms_demo" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "password_hash", length: 255 })
  passwordHash: string;

  @Column("datetime", {
    name: "created",
    default: () => "'current_timestamp(6)'",
  })
  created: Date;

  @Column("varchar", { name: "username", unique: true, length: 255 })
  username: string;

  @Column("varchar", { name: "role", length: 255, default: () => "'user'" })
  role: string;
}
