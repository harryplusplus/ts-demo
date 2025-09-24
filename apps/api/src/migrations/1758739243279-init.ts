import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1758739243279 implements MigrationInterface {
    name = 'Init1758739243279'

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
                CONSTRAINT "uq_users_uuid" UNIQUE ("uuid"),
                CONSTRAINT "uq_users_email" UNIQUE ("email"),
                CONSTRAINT "pk_users_id" PRIMARY KEY ("id")
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
                CONSTRAINT "uq_refresh_tokens_token" UNIQUE ("token"),
                CONSTRAINT "pk_refresh_tokens_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "idx_refresh_tokens_expires_at_deleted_at_user_id" ON "refresh_tokens" ("expires_at", "deleted_at", "user_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD CONSTRAINT "fk_refresh_tokens_user_id_users_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP CONSTRAINT "fk_refresh_tokens_user_id_users_id"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."idx_refresh_tokens_expires_at_deleted_at_user_id"
        `);
        await queryRunner.query(`
            DROP TABLE "refresh_tokens"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
    }

}
