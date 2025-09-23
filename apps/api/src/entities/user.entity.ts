import {
  BigIntType,
  Entity,
  Filter,
  Opt,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";

@Entity()
@Filter({ name: "softDelete", cond: { deletedAt: null }, default: true })
export class User {
  @PrimaryKey({ type: new BigIntType("string") })
  id?: string & Opt;

  @Property({ type: "uuid", unique: true })
  uuid: string & Opt = crypto.randomUUID();

  @Property({ type: "text", unique: true })
  email: string;

  @Property({ type: "text" })
  passwordHashed: string;

  @Property()
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  constructor(dto: { email: string; passwordHashed: string }) {
    this.email = dto.email;
    this.passwordHashed = dto.passwordHashed;
  }
}
