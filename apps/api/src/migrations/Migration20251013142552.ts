import { Migration } from '@mikro-orm/migrations';

export class Migration20251013142552 extends Migration {

  override async up(): Promise<void> {
    this.addSql(/* sql */ `
create table "users" (
  "id" bigint generated always as identity primary key not null,
  "uuid" uuid not null,
  "email" text not null,
  "password_hashed" text not null,
  "created_at" timestamptz not null default current_timestamp,
  "updated_at" timestamptz not null default current_timestamp,
  "deleted_at" timestamptz null
);
`);
    this.addSql(/* sql */ `
alter table "users"
add constraint "users_uuid_unique" unique ("uuid");
`);
    this.addSql(/* sql */ `
alter table "users"
add constraint "users_email_unique" unique ("email");
`);

    this.addSql(/* sql */ `
create table "refresh_tokens" (
  "id" bigint generated always as identity primary key not null,
  "token" text not null,
  "expires_at" timestamptz null,
  "created_at" timestamptz not null default current_timestamp,
  "updated_at" timestamptz not null default current_timestamp,
  "deleted_at" timestamptz null,
  "user_id" bigint not null
);
`);
    this.addSql(/* sql */ `
alter table "refresh_tokens"
add constraint "refresh_tokens_token_unique" unique ("token");
`);
    this.addSql(/* sql */ `
create index "refresh_tokens_expires_at_deleted_at_user_id_index" on "refresh_tokens" ("expires_at", "deleted_at", "user_id");
`);

    this.addSql(/* sql */ `
alter table "refresh_tokens"
add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;
`);
  }

  override async down(): Promise<void> {
    this.addSql(/* sql */ `
alter table "refresh_tokens"
drop constraint "refresh_tokens_user_id_foreign";
`);

    this.addSql(/* sql */ `
drop table if exists "users" cascade;
`);

    this.addSql(/* sql */ `
drop table if exists "refresh_tokens" cascade;
`);
  }

}
