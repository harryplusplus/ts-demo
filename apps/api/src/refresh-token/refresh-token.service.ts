import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, MoreThan, Or, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import z from "zod";
import {
  RefreshToken,
  RefreshTokenInsert,
  RefreshTokenInserter,
  RefreshTokenSchema,
} from "./refresh-token.entity";

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenSchema)
    private readonly refreshTokenRepository: Repository<RefreshToken>
  ) {}

  @Transactional()
  async existsNotExpired(input: { userId: string }) {
    const { userId } = input;
    return await this.refreshTokenRepository.exists({
      where: {
        userId,
        expiresAt: Or(IsNull(), MoreThan(new Date())),
      },
    });
  }

  @Transactional()
  async createRefreshToken(input: z.input<typeof RefreshTokenInsert>) {
    return await RefreshTokenInserter.insert(
      this.refreshTokenRepository,
      input
    );
  }

  @Transactional()
  async deleteByToken(input: { token: string }) {
    const { token } = input;
    return await this.refreshTokenRepository.softDelete({ token });
  }
}
