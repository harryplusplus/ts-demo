// import { SignupBody } from "@/auth/auth.types";
// import { hash } from "@/utils/hash";
// import { ConflictException, Injectable } from "@nestjs/common";
// import { DatabaseError } from "pg";

// @Injectable()
// export class UsersService {
//   constructor(private readonly db: Kysely) {}

//   async createUser(input: SignupBody) {
//     const { email, password } = input;
//     const uuid = crypto.randomUUID();
//     const passwordHashed = await hash(password);
//     try {
//       return await this.db
//         .insertInto("users")
//         .values({ email, passwordHashed, uuid })
//         .returning("uuid")
//         .executeTakeFirstOrThrow();
//     } catch (e) {
//       if (
//         e instanceof DatabaseError &&
//         e.code === "23505" &&
//         e.constraint === "users_email_key"
//       ) {
//         throw new ConflictException({
//           message: "This email is already registered.",
//         });
//       }

//       throw e;
//     }
//   }

//   async signin(input: { email: string; password: string }) {
//     const { email, password } = input;
//     const passwordHashed = await hash(password);
//     const res = await this.db
//       .selectFrom("users")
//       .select("uuid")
//       .where("email", "=", email)
//       .where("passwordHashed", "=", passwordHashed)
//       .where("deletedAt", "is not", null)
//       .executeTakeFirst();
//     return res;
//   }

//   async emailExists(input: { email: string }) {
//     const { email } = input;
//     const res = await this.db
//       .selectFrom("users")
//       .select("email")
//       .where("email", "=", email)
//       .executeTakeFirst();
//     return !!res;
//   }
// }
