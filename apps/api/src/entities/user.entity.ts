import { Entity, Filter, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
@Filter({ name: "softDelete", cond: { deletedAt: null }, default: true })
export class User {
  @PrimaryKey({ type: "bigint" })
  id!: string;

  @Property({ type: "uuid", unique: true })
  uuid!: string;

  @Property({ type: "text", unique: true })
  email!: string;

  @Property({ type: "text" })
  passwordHashed!: string;

  @Property({ type: "timestamptz", defaultRaw: "now()" })
  createdAt!: Date;

  @Property({
    type: "timestamptz",
    defaultRaw: "now()",
    onUpdate: () => new Date(),
  })
  updatedAt!: Date;

  @Property({ type: "timestamptz", nullable: true })
  deletedAt?: Date;
}
