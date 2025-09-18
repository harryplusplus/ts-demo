import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hash(value: string) {
  const hashed = await bcrypt.hash(value, SALT_ROUNDS);
  return hashed;
}
