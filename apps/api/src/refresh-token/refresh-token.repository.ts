import { BaseRepository } from "@/db/base-repository";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { RefreshToken } from "./refresh-token.entity";

@Injectable()
export class RefreshTokenRepository extends BaseRepository<
  RefreshToken,
  Pick<RefreshToken, "token" | "expiresAt" | "userId">
> {
  constructor(dataSource: DataSource) {
    super(RefreshToken, dataSource);
  }
}
