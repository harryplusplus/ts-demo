import {
  Entity,
  Filter,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { User } from "./user.entity.js";

@Entity()
@Filter({ name: "softDelete", cond: { deletedAt: null }, default: true })
@Index({ properties: ["user", "expiresAt", "deletedAt"] })
export class RefreshToken {
  @PrimaryKey({ type: "bigint" })
  id!: string;

  @Property({ type: "text", unique: true })
  token!: string;

  @Property({ type: "timestamptz", nullable: true })
  expiresAt?: Date;

  @Property({ type: "timestamptz" })
  createdAt!: Date;

  @Property({
    type: "timestamptz",
    defaultRaw: "now()",
    onUpdate: () => new Date(),
  })
  updatedAt!: Date;

  @Property({ type: "timestamptz", nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User)
  user!: User;
}
