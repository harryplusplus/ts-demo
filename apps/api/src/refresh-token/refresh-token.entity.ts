import { Required } from "@/types/required";
import { User } from "@/user/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "refresh_tokens" })
@Index(["expiresAt", "deletedAt", "user"])
export class RefreshToken {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "text", unique: true })
  token!: string & Required;

  @Column({ type: "timestamptz", nullable: true })
  expiresAt!: (Date | null) & Required;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deletedAt!: Date | null;

  @Column({ type: "bigint" })
  userId!: string & Required;

  @ManyToOne(() => User)
  user?: User;
}
