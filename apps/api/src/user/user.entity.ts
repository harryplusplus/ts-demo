import { Inserter } from "@/db/inserter";
import { BigIntString } from "@/zod-types";
import { EntitySchema } from "typeorm";
import z from "zod";

export const User = z.object({
  id: BigIntString,
  uuid: z.uuidv4().default(() => crypto.randomUUID()),
  email: z.email(),
  passwordHashed: z.string().nonempty(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});
export type User = z.infer<typeof User>;

export const UserInsert = User.pick({
  uuid: true,
  email: true,
  passwordHashed: true,
});

export const UserInserter = new Inserter<User, typeof UserInsert>(UserInsert);

export const UserSchema = new EntitySchema<User>({
  name: "user",
  tableName: "users",
  columns: {
    id: { type: "bigint", primary: true, generated: "increment" },
    uuid: { type: "uuid", unique: true },
    email: { type: "text", unique: true },
    passwordHashed: { type: "text" },
    createdAt: { type: "timestamptz", createDate: true },
    updatedAt: { type: "timestamptz", updateDate: true },
    deletedAt: { type: "timestamptz", deleteDate: true },
  },
});
