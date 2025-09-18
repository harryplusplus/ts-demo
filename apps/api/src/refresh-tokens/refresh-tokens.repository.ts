import { isUniqueViolation } from "@/pg/pg.utils";
import { KyselyTransactionalAdapter } from "@/transactional/transactional.types";
import { InjectTransaction, Transaction } from "@nestjs-cls/transactional";
import { ConflictException, Injectable } from "@nestjs/common";

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @InjectTransaction()
    private readonly tx: Transaction<KyselyTransactionalAdapter>
  ) {}

  async createRefreshToken(input: {
    userId: string;
    token: string;
    issuedAt: Date;
    expiresAt: Date;
  }) {
    const { userId, token, issuedAt, expiresAt } = input;
    try {
      await this.tx
        .insertInto("refreshTokens")
        .values({ userId, token, issuedAt, expiresAt })
        .executeTakeFirstOrThrow();
    } catch (e) {
      if (isUniqueViolation("refreshTokens", "token", e)) {
        throw new ConflictException("This token is already registered.");
      }

      throw e;
    }
  }

  async findAllRefreshTokensByUserId(input: { userId: string }) {
    const { userId } = input;
    return await this.tx
      .selectFrom("refreshTokens")
      .select("token")
      .where("userId", "=", userId)
      .execute();
  }
}
