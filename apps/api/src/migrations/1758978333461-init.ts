import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1758978333461 implements MigrationInterface {
    name = 'Init1758978333461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" BIGSERIAL NOT NULL,
                "uuid" uuid NOT NULL,
                "email" text NOT NULL,
                "password_hashed" text NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "users_uuid_unique" UNIQUE ("uuid"),
                CONSTRAINT "users_email_unique" UNIQUE ("email"),
                CONSTRAINT "users_id_primary_key" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id" BIGSERIAL NOT NULL,
                "token" text NOT NULL,
                "expires_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "user_id" bigint NOT NULL,
                CONSTRAINT "refresh_tokens_token_unique" UNIQUE ("token"),
                CONSTRAINT "refresh_tokens_id_primary_key" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "refresh_tokens_expires_at_deleted_at_user_id_index" ON "refresh_tokens" ("expires_at", "deleted_at", "user_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "refresh_tokens_user_id_users_id_foreign_key" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_users_id_foreign_key"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."refresh_tokens_expires_at_deleted_at_user_id_index"
        `);
        await queryRunner.query(`
            DROP TABLE "refresh_tokens"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
    }

}
