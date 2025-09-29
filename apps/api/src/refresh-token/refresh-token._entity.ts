// import { Inserter } from "@/db/inserter";
// import { User, UserSchema } from "@/user/user.entity";
// import { BigIntString } from "@/zod-types";
// import { EntitySchema } from "typeorm";
// import z from "zod";

// export const RefreshToken = z.object({
//   id: BigIntString,
//   token: z.string().nonempty(),
//   expiresAt: z.date().nullable(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
//   deletedAt: z.date().nullable(),
//   userId: BigIntString,
//   get user() {
//     return User.optional();
//   },
// });
// export type RefreshToken = z.infer<typeof RefreshToken>;

// export const RefreshTokenInsert = RefreshToken.pick({
//   token: true,
//   expiresAt: true,
//   userId: true,
// });

// export const RefreshTokenInserter = new Inserter<
//   RefreshToken,
//   typeof RefreshTokenInsert
// >(RefreshTokenInsert);

// export const RefreshTokenSchema = new EntitySchema<RefreshToken>({
//   name: "refreshToken",
//   tableName: "refresh_tokens",
//   columns: {
//     id: { type: "bigint", primary: true, generated: "increment" },
//     token: { type: "text", unique: true },
//     expiresAt: { type: "timestamptz", nullable: true },
//     createdAt: { type: "timestamptz", createDate: true },
//     updatedAt: { type: "timestamptz", updateDate: true },
//     deletedAt: { type: "timestamptz", deleteDate: true },
//     userId: { type: "bigint" },
//   },
//   relations: {
//     user: {
//       type: "many-to-one",
//       target: UserSchema.options.name,
//       onDelete: "CASCADE",
//     },
//   },
//   indices: [
//     {
//       columns: ["expiresAt", "deletedAt", "userId"],
//     },
//   ],
// });
