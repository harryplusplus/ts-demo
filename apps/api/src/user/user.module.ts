import { DbModule } from "@/db/db.module";
import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";

@Module({ imports: [DbModule], controllers: [UserController] })
export class UserModule {}
