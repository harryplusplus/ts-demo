import { DataSource } from "typeorm";
import { initDataSource } from "../../tests/config";
import { createOneFromRequiredOnly } from "../types/required";
import { User } from "./user.entity";

console.log(process.env);

let db: DataSource;

beforeAll(async () => {
  db = await initDataSource();
});

afterAll(async () => {
  await db?.destroy();
});

describe("test", () => {
  test("test", async () => {
    const userRepository = db.manager.getRepository(User);
    const user = await createOneFromRequiredOnly(userRepository, {
      email: "user@email.com",
      passwordHashed: "",
    });
    console.log(user);
  });
});
