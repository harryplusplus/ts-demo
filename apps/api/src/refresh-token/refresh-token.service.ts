import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, ref, Transactional } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { User } from "../user/user.entity.js";
import { RefreshToken } from "./refresh-token.entity.js";

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: EntityRepository<RefreshToken>
  ) {}

  @Transactional()
  async existsNotExpired(input: { userId: string }) {
    const { userId } = input;
    const count = await this.refreshTokenRepository.count({
      user: userId,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    });
    return count > 0;
  }

  @Transactional()
  async createRefreshToken(
    input: Pick<RefreshToken, "expiresAt" | "token"> & { userId: string }
  ) {
    await Promise.resolve();
    const refreshToken = new RefreshToken();
    refreshToken.expiresAt = input.expiresAt;
    refreshToken.token = input.token;
    refreshToken.user = ref(User, input.userId);
    this.refreshTokenRepository.getEntityManager().persist(refreshToken);
    return refreshToken;
  }

  @Transactional()
  async deleteByToken(input: { token: string }) {
    const { token } = input;
    const res = await this.refreshTokenRepository
      .createQueryBuilder()
      .update({ deletedAt: new Date() })
      .where({ token, deletedAt: null })
      .execute("run");
    return res.affectedRows === 1;
  }
}
