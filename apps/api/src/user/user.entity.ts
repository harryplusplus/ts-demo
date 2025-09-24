import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id!: string;

  @Column({ type: "uuid", unique: true })
  uuid: string = crypto.randomUUID();

  @Column({ type: "text", unique: true })
  email!: string;

  @Column({ type: "text" })
  passwordHashed!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @DeleteDateColumn({ type: "timestamptz" })
  deletedAt: Date | null = null;
}
