import { createReference, ReferenceSource } from "@/types/mikro-utils";
import {
  BigIntType,
  Entity,
  Filter,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  type Ref,
} from "@mikro-orm/core";
import { User } from "./user.entity";

@Entity()
@Filter({ name: "softDelete", cond: { deletedAt: null }, default: true })
@Index({ properties: ["user", "expiresAt", "deletedAt"] })
export class RefreshToken {
  @PrimaryKey({ type: new BigIntType("string") })
  id?: string;

  @Property({ type: "text", unique: true })
  token: string;

  @Property({ type: "timestamptz", nullable: true })
  expiresAt?: Date;

  @Property({ type: "timestamptz" })
  createdAt: Date;

  @Property({ type: "timestamptz", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: "timestamptz", nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, { ref: true })
  user: Ref<User>;

  constructor(dto: {
    token: string;
    expiresAt?: Date;
    createdAt: Date;
    user: ReferenceSource<User>;
  }) {
    this.token = dto.token;
    if (dto.expiresAt) {
      this.expiresAt = dto.expiresAt;
    }
    this.createdAt = dto.createdAt;
    this.user = createReference(User, dto.user);
  }
}
