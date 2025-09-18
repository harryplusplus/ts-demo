import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hash(plain: string) {
  const hashed = await bcrypt.hash(plain, SALT_ROUNDS);
  return hashed;
}

export async function compare(plain: string, hashed: string) {
  return await bcrypt.compare(plain, hashed);
}
