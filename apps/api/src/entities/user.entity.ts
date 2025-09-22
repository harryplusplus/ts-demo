import { Entity, Filter, Opt, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
@Filter({ name: "softDelete", cond: { deletedAt: null }, default: true })
export class User {
  @PrimaryKey({ type: "bigint" })
  id!: string & Opt;

  @Property({ type: "uuid", unique: true })
  uuid: string & Opt = crypto.randomUUID();

  @Property({ unique: true })
  email!: string;

  @Property()
  passwordHashed!: string;

  @Property()
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;
}
