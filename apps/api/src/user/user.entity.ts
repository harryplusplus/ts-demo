import { CURRENT_TIMESTAMP, IDENTITY } from "@/db/constants";
import { BigIntType, Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "users" })
export class User {
  @PrimaryKey({
    type: new BigIntType("string"),
    generated: IDENTITY,
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
}
