import { Migration } from '@mikro-orm/migrations';

export class Migration20250929175043 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
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
    this.addSql(`
alter table "users"
add constraint "users_uuid_unique" unique ("uuid");
`);
    this.addSql(`
alter table "users"
add constraint "users_email_unique" unique ("email");
`);
    this.addSql(`
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
    this.addSql(`
alter table "refresh_tokens"
add constraint "refresh_tokens_token_unique" unique ("token");
`);
    this.addSql(`
create index "refresh_tokens_expires_at_deleted_at_user_id_index" on "refresh_tokens" ("expires_at", "deleted_at", "user_id");
`);
    this.addSql(`
alter table "refresh_tokens"
add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;
`);
    this.addSql(`
create or replace function "fn_update_timestamp_users_updated_at" () returns trigger as \$\$
begin
  new."updated_at" := current_timestamp;
  return new;
end;
\$\$ language plpgsql;
`);
    this.addSql(`
create trigger "tr_update_timestamp_users_updated_at" before
update on "users" for each row
execute function "fn_update_timestamp_users_updated_at" ();
`);
    this.addSql(`
create or replace function "fn_update_timestamp_refresh_tokens_updated_at" () returns trigger as \$\$
begin
  new."updated_at" := current_timestamp;
  return new;
end;
\$\$ language plpgsql;
`);
    this.addSql(`
create trigger "tr_update_timestamp_refresh_tokens_updated_at" before
update on "refresh_tokens" for each row
execute function "fn_update_timestamp_refresh_tokens_updated_at" ();
`);
  }

  override async down(): Promise<void> {
    this.addSql(`
drop trigger if exists "tr_update_timestamp_refresh_tokens_updated_at" ON "refresh_tokens";
`);
    this.addSql(`
drop function if exists "fn_update_timestamp_refresh_tokens_updated_at" ();
`);
    this.addSql(`
drop trigger if exists "tr_update_timestamp_users_updated_at" ON "users";
`);
    this.addSql(`
drop function if exists "fn_update_timestamp_users_updated_at" ();
`);
    this.addSql(`
alter table "refresh_tokens"
drop constraint "refresh_tokens_user_id_foreign";
`);
    this.addSql(`
drop table if exists "users" cascade;
`);
    this.addSql(`
drop table if exists "refresh_tokens" cascade;
`);
  }

}
