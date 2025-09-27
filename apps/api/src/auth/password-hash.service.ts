import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

@Injectable()
export class PasswordHashService {
  async hash(input: { password: string }) {
    const { password } = input;
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  async compare(input: { password: string; passwordHashed: string }) {
    const { password, passwordHashed } = input;
    return await bcrypt.compare(password, passwordHashed);
  }
}
