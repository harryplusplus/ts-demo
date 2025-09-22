// import { isUniqueViolation } from "@/pg/pg-utils";
// import { KyselyTransactionalAdapter } from "@/transactional/transactional-types";
// import { InjectTransaction, type Transaction } from "@nestjs-cls/transactional";
// import { ConflictException, Injectable } from "@nestjs/common";

// @Injectable()
// export class RefreshTokensRepository {
//   constructor(
//     @InjectTransaction()
//     private readonly tx: Transaction<KyselyTransactionalAdapter>
//   ) {}

//   async create(input: {
//     userId: string;
//     token: string;
//     issuedAt: Date;
//     expiresAt: Date;
//   }) {
//     const { userId, token, issuedAt, expiresAt } = input;
//     try {
//       await this.tx
//         .insertInto("refreshTokens")
//         .values({ userId, token, issuedAt, expiresAt })
//         .executeTakeFirstOrThrow();
//     } catch (e) {
//       if (isUniqueViolation("refreshTokens", "token", e)) {
//         throw new ConflictException("This token is already registered.");
//       }

//       throw e;
//     }
//   }

//   async findFirstByUserId(input: { userId: string }) {
//     const { userId } = input;
//     return await this.tx
//       .selectFrom("refreshTokens")
//       .select("token")
//       .where("userId", "=", userId)
//       .where("deletedAt", "is", null)
//       .where((eb) =>
//         eb("expiresAt", "is", null).or("expiresAt", ">", new Date())
//       )
//       .limit(1)
//       .executeTakeFirst();
//   }

//   async deleteByToken(input: { token: string }) {
//     const { token } = input;
//     return await this.tx
//       .updateTable("refreshTokens")
//       .set({ deletedAt: new Date() })
//       .where("token", "=", token)
//       .where("deletedAt", "is", null)
//       .executeTakeFirst();
//   }
// }
