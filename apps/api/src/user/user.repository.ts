import { BaseRepository } from "@/db/base-repository";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserRepository extends BaseRepository<
  User,
  Pick<User, "email" | "passwordHashed">
> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }
}
