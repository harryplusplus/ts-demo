import { Migration } from '@mikro-orm/migrations';

export class Migration20250922111213 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" bigserial primary key, "uuid" uuid not null);`);
    this.addSql(`alter table "user" add constraint "user_uuid_unique" unique ("uuid");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }

}
