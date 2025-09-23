import {
  BigIntType,
  Entity,
  Filter,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";

@Entity()
@Filter({ name: "softDelete", cond: { deletedAt: null }, default: true })
export class User {
  @PrimaryKey({ type: new BigIntType("string") })
  id?: string;

  @Property({ type: "uuid", unique: true })
  uuid: string = crypto.randomUUID();

  @Property({ type: "text", unique: true })
  email: string;

  @Property({ type: "text" })
  passwordHashed: string;

  @Property({ type: "timestamptz" })
  createdAt: Date = new Date();

  @Property({ type: "timestamptz", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: "timestamptz", nullable: true })
  deletedAt?: Date;

  constructor(dto: { email: string; passwordHashed: string }) {
    this.email = dto.email;
    this.passwordHashed = dto.passwordHashed;
  }
}
