import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class User {
  @PrimaryKey({ type: "bigint" })
  id!: string;

  @Property({ type: "uuid", unique: true })
  uuid: string = crypto.randomUUID();

  // @Property({ type: "text" })
  // email!: string;
}
