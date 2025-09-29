import { EntityRepository, MikroORM } from "@mikro-orm/postgresql";
import deepmerge from "deepmerge";
import { initOrm } from "dev/test-utils";
import z from "zod";
import { User } from "./user.entity";

let orm: MikroORM;
let userRepository: EntityRepository<User>;

beforeAll(async () => {
  orm = await initOrm();
  userRepository = orm.em.getRepository(User);
});

afterAll(async () => {
  await orm?.close();
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
