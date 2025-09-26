import { RequiredOnly } from "@/types/required";
import { DataSource, DeepPartial, ObjectLiteral, Repository } from "typeorm";
import { initDataSource } from "../../tests/config";
import { User } from "./user.entity";

let db: DataSource;

beforeAll(async () => {
  db = await initDataSource();
});

afterAll(async () => {
  await db?.destroy();
});

describe("User entity", () => {
  let userRepository: Repository<User>;

  beforeAll(() => {
    userRepository = db.manager.getRepository(User);
  });

  let created: User;

  test("create", () => {
    const input: RequiredOnly<User> = {
      email: "user@email.com",
      passwordHashed: "1",
    };
    created = userRepository.create(input as DeepPartial<User>);
    expect(created.constructor).toBe(User);
    expect(created).toEqual({
      createdAt: undefined,
      deletedAt: null,
      email: "user@email.com",
      id: undefined,
      passwordHashed: "1",
      updatedAt: undefined,
      uuid: expect.any(String) as unknown,
    });
  });

  let inserted: ObjectLiteral;

  test("insert", async () => {
    const insertRes = await userRepository.insert(created);
    expect(insertRes).toMatchObject({
      generatedMaps: [{}],
    });
    inserted = insertRes.generatedMaps[0]!;
    expect(inserted).toEqual({
      createdAt: expect.any(Date) as unknown,
      deletedAt: null,
      id: "1",
      updatedAt: expect.any(Date) as unknown,
    });
  });

  test("merge", () => {
    const merged = userRepository.merge(created, inserted);
    expect(merged.constructor).toBe(User);
    expect(merged).toEqual({
      createdAt: inserted["createdAt"] as unknown,
      deletedAt: inserted["deletedAt"] as unknown,
      email: created.email as unknown,
      id: inserted["id"] as unknown,
      passwordHashed: created.passwordHashed as unknown,
      updatedAt: inserted["updatedAt"] as unknown,
      uuid: created.uuid,
    });
  });
});
