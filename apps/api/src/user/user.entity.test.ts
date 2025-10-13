import { EntityManager, MikroORM, wrap } from "@mikro-orm/postgresql";
import { afterAll, beforeAll, expect, test } from "vitest";
import { initOrm } from "../../tests/_common.js";
import { User } from "./user.entity.js";

let orm: MikroORM;
let em: EntityManager;

beforeAll(async () => {
  orm = await initOrm();
  em = orm.em.fork();
});

afterAll(async () => {
  await orm?.close();
});

let userId: string;

test("create", async () => {
  const user = new User();
  em.persist(user);

  expect(wrap(user).isInitialized()).toBe(true);
  expect(wrap(user, true).hasPrimaryKey()).toBe(false);

  wrap(user).assign({ email: "user@email.com", passwordHashed: "1" });
  expect(user).toMatchObject({
    email: "user@email.com",
    passwordHashed: "1",
    deletedAt: null,
    uuid: expect.any(String) as unknown,
  });

  await em.flush();

  expect(wrap(user).isInitialized()).toBe(true);
  expect(wrap(user, true).hasPrimaryKey()).toBe(true);

  userId = user.id;
});

test("find from identity map", async () => {
  const user = await em.findOneOrFail(User, { id: userId });

  expect(wrap(user).isInitialized()).toBe(true);
  expect(wrap(user, true).hasPrimaryKey()).toBe(true);
});

test("find from db", async () => {
  const em2 = em.fork();
  const user = await em2.findOneOrFail(User, { id: userId });

  expect(wrap(user).isInitialized()).toBe(true);
  expect(wrap(user, true).hasPrimaryKey()).toBe(true);
});

test("safe delete", async () => {
  {
    const user = em.getReference(User, userId);
    em.remove(user);
    await em.flush();
  }
  {
    const user = await em
      .qb(User)
      .select("*")
      .where({ id: userId })
      .execute("get");
    expect(user).toMatchObject({
      deletedAt: expect.any(Date) as unknown,
    });
  }
});
