import { RequiredOnly } from "@/types/required";
import { DataSource, DeepPartial, ObjectLiteral, Repository } from "typeorm";
import z from "zod";
import { expectAny, initDataSource } from "../../tests/common";
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

  const createdSchema = z.object({
    deletedAt: z.null(),
    email: z.email(),
    passwordHashed: z.string(),
    uuid: z.string(),
  });
  let created: User & { __partial?: true };

  test("create", () => {
    const input: RequiredOnly<User> = {
      email: "user@email.com",
      passwordHashed: "1",
    };
    created = userRepository.create(input as DeepPartial<User>);
    createdSchema.parse(created);
    expect(created).toEqual({
      createdAt: undefined,
      deletedAt: null,
      email: "user@email.com",
      id: undefined,
      passwordHashed: "1",
      updatedAt: undefined,
      uuid: expectAny(String),
    });
  });

  const insertedSchema = z
    .object({
      createdAt: z.date(),
      deletedAt: z.null(),
      id: z.string(),
      updatedAt: z.date(),
    })
    .strict();
  let inserted: z.infer<typeof insertedSchema>;

  test("insert", async () => {
    const insertRes = await userRepository.insert(created);
    expect(insertRes).toMatchObject({
      generatedMaps: [{}],
    });
    inserted = insertedSchema.parse(insertRes.generatedMaps[0]!);
    expect(inserted).toEqual({
      createdAt: expectAny(Date),
      deletedAt: null,
      id: "1",
      updatedAt: expectAny(Date),
    });
  });

  test("merge", () => {
    const merged = userRepository.merge(created, inserted);
    expect(merged.constructor).toBe(User);
    const a = created.email!;
    const b = created.passwordHashed;
    expect(merged).toEqual({
      createdAt: inserted.createdAt,
      deletedAt: inserted.deletedAt,
      email: created.email,
      id: inserted.id,
      passwordHashed: created.passwordHashed,
      updatedAt: inserted.updatedAt,
      uuid: created.uuid,
    });
  });
});
