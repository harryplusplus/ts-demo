import {
  Entity,
  Filter,
  Index,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { User } from "./user.entity";

@Entity()
@Filter({ name: "softDelete", cond: { deletedAt: null }, default: true })
@Index({ properties: ["user", "expiresAt", "deletedAt"] })
export class RefreshToken {
  @PrimaryKey({ type: "bigint" })
  id!: bigint & Opt;

  @Property({ type: "text", unique: true })
  token!: string;

  @Property({ nullable: true })
  expiresAt?: Date;

  @Property()
  createdAt!: Date;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User)
  user!: User;
}
