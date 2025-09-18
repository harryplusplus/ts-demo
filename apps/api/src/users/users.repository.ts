import { isUniqueViolation } from "@/pg/pg.utils";
import { KyselyTransactionalAdapter } from "@/transactional/transactional.types";
import { hash } from "@/utils/hash";
import { InjectTransaction, Transaction } from "@nestjs-cls/transactional";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  UnsafeCreateUserInput,
  UnsafeGetUserByEmailInput,
  UnsafeGetUserInput,
} from "./users.types";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectTransaction()
    private readonly tx: Transaction<KyselyTransactionalAdapter>
  ) {}

  async unsafeCreateUser(input: UnsafeCreateUserInput) {
    const { email, password } = input;
    const uuid = crypto.randomUUID();
    const passwordHashed = await hash(password);
    try {
      return await this.tx
        .insertInto("users")
        .values({ email, passwordHashed, uuid })
        .returning(["uuid", "id"])
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

  async unsafeGetUser(input: UnsafeGetUserInput) {
    const unsafeUser = await this.unsafeGetUserByEmail(input);
    const { password } = input;
    const actualPasswordHashed = await hash(password);
    if (actualPasswordHashed !== unsafeUser.passwordHashed) {
      throw new BadRequestException("Invalid password.");
    }

    return unsafeUser;
  }

  async unsafeGetUserByEmail(input: UnsafeGetUserByEmailInput) {
    const { email } = input;
    const unsafeUser = await this.tx
      .selectFrom("users")
      .select(["uuid", "passwordHashed"])
      .where("email", "=", email)
      .where("deletedAt", "is not", null)
      .executeTakeFirst();

    if (!unsafeUser) {
      throw new NotFoundException("Uer not found.");
    }

    return unsafeUser;
  }
}
