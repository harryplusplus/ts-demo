import { Migration } from '@mikro-orm/migrations';

export class Migration20250922190453 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" bigserial primary key, "uuid" uuid not null, "email" text not null, "password_hashed" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null);`);
    this.addSql(`alter table "user" add constraint "user_uuid_unique" unique ("uuid");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "refresh_token" ("id" bigserial primary key, "token" text not null, "expires_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "user_id" bigint not null);`);
    this.addSql(`alter table "refresh_token" add constraint "refresh_token_token_unique" unique ("token");`);
    this.addSql(`create index "refresh_token_user_id_expires_at_deleted_at_index" on "refresh_token" ("user_id", "expires_at", "deleted_at");`);

    this.addSql(`alter table "refresh_token" add constraint "refresh_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "refresh_token" drop constraint "refresh_token_user_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "refresh_token" cascade;`);
  }

}
