import {
  EntityManager,
  EntityRepository,
  MikroORM,
  wrap,
} from "@mikro-orm/postgresql";
import { initOrm } from "dev/test-utils";
import { User } from "./user.entity";

let orm: MikroORM;
let em: EntityManager;
let userRepository: EntityRepository<User>;

beforeAll(async () => {
  orm = await initOrm();
  em = orm.em.fork();
  userRepository = em.getRepository(User);
});

afterAll(async () => {
  await orm?.close();
});

describe("user entity", () => {
  let inserted: User;

  test("insert", async () => {
    const user = new User();
    expect(wrap(user).isInitialized()).toBe(true);

    console.log(JSON.stringify(user, null));
    user.email = "user@email.com";
    user.passwordHashed = "1";

    em.persist(user);
    console.log(JSON.stringify(user, null));
    await em.flush();
    expect(wrap(user).isInitialized()).toBe(true);
  });

  // test("insert", async () => {
  //   const input: z.input<typeof UserInsert> = {
  //     email: "user@email.com",
  //     passwordHashed: "a",
  //   };
  //   const insert = UserInsert.parse(input);
  //   const insertRes = await userRepository.insert(insert);
  //   const merged = deepmerge(insert, insertRes.generatedMaps[0]!);
  //   const parsed = User.parse(merged);
  //   expect(parsed).toEqual<User>({
  //     ...insert,
  //     createdAt: expectAny(Date),
  //     deletedAt: null,
  //     id: "1",
  //     updatedAt: expectAny(Date),
  //   });
  //   inserted = parsed;
  // });

  // test("findOne", async () => {
  //   const user = await userRepository.findOne({
  //     where: {
  //       id: inserted.id,
  //     },
  //   });
  //   expect(user).toEqual<User>(inserted);
  // });
});
