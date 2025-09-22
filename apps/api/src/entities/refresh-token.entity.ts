import {
  Entity,
  Filter,
  Index,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { User } from "./user.entity.js";

@Entity()
@Filter({ name: "softDelete", cond: { deletedAt: null }, default: true })
@Index({ properties: ["user", "expiresAt", "deletedAt"] })
export class RefreshToken {
  @PrimaryKey({ type: "bigint" })
  id!: string & Opt;

  @Property({ type: "text", unique: true })
  token!: string;

  @Property({ type: "timestamptz", nullable: true })
  expiresAt?: Date;

  @Property({ type: "timestamptz" })
  createdAt!: Date;

  @Property({ type: "timestamptz", onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();

  @Property({ type: "timestamptz", nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User)
  user!: User;
}
