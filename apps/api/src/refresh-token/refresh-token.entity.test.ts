import { User, UserInserter, UserSchema } from "@/user/user.entity";
import { addDays } from "date-fns";
import deepmerge from "deepmerge";
import { DataSource, Repository } from "typeorm";
import z from "zod";
import { expectAny, initDataSource } from "../../tests/common";
import {
  RefreshToken,
  RefreshTokenInsert,
  RefreshTokenSchema,
} from "./refresh-token.entity";

let db: DataSource;
let refreshTokenRepository: Repository<RefreshToken>;
let userRepository: Repository<User>;
let user: User;

beforeAll(async () => {
  db = await initDataSource();
  db.setOptions({ logging: ["query"] });
  refreshTokenRepository = db.manager.getRepository(RefreshTokenSchema);
  userRepository = db.manager.getRepository(UserSchema);
  user = await UserInserter.insert(userRepository, {
    email: "user@email.com",
    passwordHashed: "a",
  });
});

afterAll(async () => {
  await db?.destroy();
});

describe("refreshToken entity", () => {
  let inserted: RefreshToken;

  test("insert", async () => {
    const input: z.input<typeof RefreshTokenInsert> = {
      token: "a",
      expiresAt: addDays(new Date(), 1),
      userId: user.id,
    };
    const insert = RefreshTokenInsert.parse(input);
    const insertRes = await refreshTokenRepository.insert(insert);
    const merged = deepmerge(insert, insertRes.generatedMaps[0]!);
    inserted = RefreshToken.parse(merged);
    expect(inserted).toEqual<RefreshToken>({
      ...insert,
      createdAt: expectAny(Date),
      deletedAt: null,
      id: "1",
      updatedAt: expectAny(Date),
    });
  });

  test("findOne", async () => {
    const refreshToken = await refreshTokenRepository.findOne({
      where: {
        id: inserted.id,
      },
    });
    expect(refreshToken).toEqual<RefreshToken>(inserted);
  });

  test("findOne with user", async () => {
    const refreshToken = await refreshTokenRepository.findOne({
      where: {
        id: inserted.id,
      },
      relations: { user: true },
    });
    expect(refreshToken).toEqual<RefreshToken>({
      ...inserted,
      user,
    });
  });
});
