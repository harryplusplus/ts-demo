import {
  BigIntType,
  Entity,
  Filter,
  Index,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
  ref,
  type Ref,
} from "@mikro-orm/core";
import { User } from "./user.entity";

@Entity()
@Filter({ name: "softDelete", cond: { deletedAt: null }, default: true })
@Index({ properties: ["user", "expiresAt", "deletedAt"] })
export class RefreshToken {
  @PrimaryKey({ type: new BigIntType("string") })
  id?: string & Opt;

  @Property({ type: "text", unique: true })
  token!: string;

  @Property({ nullable: true })
  expiresAt?: Date;

  @Property()
  createdAt!: Date;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, { ref: true })
  user!: Ref<User>;

  constructor(user: User) {
    this.user = ref(user);
  }
}
