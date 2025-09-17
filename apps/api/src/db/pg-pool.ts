import { Injectable } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class PgPool extends Pool {
  constructor() {
    super({
      connectionString: process.env.DATABASE_URL,
    });
  }
}
