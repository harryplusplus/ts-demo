import { DB } from "@/types/db";
import { DatabaseError } from "pg";

export function isUniqueViolation<
  Table extends keyof DB,
  Column extends keyof DB[Table] & string
>(table: Table, column: Column, e: unknown): e is DatabaseError {
  return (
    e instanceof DatabaseError &&
    e.code === "23505" &&
    e.constraint === `${table}_${column}_key`
  );
}
