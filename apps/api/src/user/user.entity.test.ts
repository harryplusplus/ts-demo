import deepmerge from "deepmerge";
import { DataSource, Repository } from "typeorm";
import z from "zod";
import { expectAny, initDataSource } from "../../tests/common";
import { User, UserInsert, UserSchema } from "./user.entity";

let db: DataSource;
let userRepository: Repository<User>;

beforeAll(async () => {
  db = await initDataSource();
  db.setOptions({ logging: ["query"] });
  userRepository = db.manager.getRepository(UserSchema);
});

afterAll(async () => {
  await db?.destroy();
});

describe("user entity", () => {
  let inserted: User;

  test("insert", async () => {
    const input: z.input<typeof UserInsert> = {
      email: "user@email.com",
      passwordHashed: "a",
    };
    const insert = UserInsert.parse(input);
    const insertRes = await userRepository.insert(insert);
    const merged = deepmerge(insert, insertRes.generatedMaps[0]!);
    const parsed = User.parse(merged);
    expect(parsed).toEqual<User>({
      ...insert,
      createdAt: expectAny(Date),
      deletedAt: null,
      id: "1",
      updatedAt: expectAny(Date),
    });
    inserted = parsed;
  });

  test("findOne", async () => {
    const user = await userRepository.findOne({
      where: {
        id: inserted.id,
      },
    });
    expect(user).toEqual<User>(inserted);
  });
});
