import { isUniqueViolation } from "@/pg/pg-utils";
import { KyselyTransactionalAdapter } from "@/transactional/transactional-types";
import { InjectTransaction, type Transaction } from "@nestjs-cls/transactional";
import { ConflictException, Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectTransaction()
    private readonly tx: Transaction<KyselyTransactionalAdapter>
  ) {}

  async create(input: { email: string; passwordHashed: string }) {
    const { email, passwordHashed } = input;
    const uuid = crypto.randomUUID();
    try {
      return await this.tx
        .insertInto("users")
        .values({ email, passwordHashed, uuid })
        .returning("uuid")
        .executeTakeFirstOrThrow();
    } catch (e) {
      if (isUniqueViolation("users", "email", e)) {
        throw new ConflictException({
          message: "This email is already registered.",
        });
      }

      throw e;
    }
  }

  async findByEmail(input: { email: string }) {
    const { email } = input;
    return await this.tx
      .selectFrom("users")
      .select(["id", "uuid", "passwordHashed"])
      .where("email", "=", email)
      .where("deletedAt", "is", null)
      .executeTakeFirst();
  }

  async findByUuid(input: { uuid: string }) {
    const { uuid } = input;
    return await this.tx
      .selectFrom("users")
      .select(["id", "uuid"])
      .where("uuid", "=", uuid)
      .where("deletedAt", "is", null)
      .executeTakeFirst();
  }
}
