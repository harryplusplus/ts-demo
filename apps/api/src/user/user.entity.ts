import {
  BigIntType,
  Entity,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
} from "@mikro-orm/core";
import { SoftDeletable } from "mikro-orm-soft-delete";
import { CURRENT_TIMESTAMP, IDENTITY_PRIMARY_KEY } from "../db/constants.js";

@SoftDeletable(() => User, "deletedAt", () => new Date())
@Entity({ tableName: "users" })
export class User {
  @PrimaryKey({
    type: new BigIntType("string"),
    generated: IDENTITY_PRIMARY_KEY,
  })
  id!: string;

  @Property({ type: "uuid", unique: true })
  uuid: string = crypto.randomUUID();

  @Property({ type: "text", unique: true })
  email!: string;

  @Property({ type: "text" })
  passwordHashed!: string;

  @Property({ type: "timestamptz", defaultRaw: CURRENT_TIMESTAMP })
  createdAt!: Date;

  @Property({ type: "timestamptz", defaultRaw: CURRENT_TIMESTAMP })
  updatedAt!: Date;

  @Property({ type: "timestamptz", nullable: true })
  deletedAt: Date | null = null;

  [PrimaryKeyProp]?: "id";
}
