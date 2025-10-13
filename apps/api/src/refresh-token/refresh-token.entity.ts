import {
  BigIntType,
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  type Ref,
} from "@mikro-orm/core";
import { SoftDeletable } from "mikro-orm-soft-delete";
import { CURRENT_TIMESTAMP, IDENTITY_PRIMARY_KEY } from "../db/constants.js";
import { User } from "../user/user.entity.js";

@Index({ properties: ["expiresAt", "deletedAt", "user"] })
@SoftDeletable(() => RefreshToken, "deletedAt", () => new Date())
@Entity({ tableName: "refresh_tokens" })
export class RefreshToken {
  @PrimaryKey({
    type: new BigIntType("string"),
    generated: IDENTITY_PRIMARY_KEY,
  })
  id!: string;

  @Property({ type: "text", unique: true })
  token!: string;

  @Property({ type: "timestamptz", nullable: true })
  expiresAt: Date | null = null;

  @Property({ type: "timestamptz", defaultRaw: CURRENT_TIMESTAMP })
  createdAt!: Date;

  @Property({ type: "timestamptz", defaultRaw: CURRENT_TIMESTAMP })
  updatedAt!: Date;

  @Property({ type: "timestamptz", nullable: true })
  deletedAt: Date | null = null;

  @ManyToOne({ entity: () => User, ref: true })
  user!: Ref<User>;
}
