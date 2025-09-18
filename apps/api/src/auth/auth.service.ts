import { RefreshTokensRepository } from "@/refresh-tokens/refresh-tokens.repository";
import { UsersRepository } from "@/users/users.repository";
import { Transactional } from "@nestjs-cls/transactional";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { addDays } from "date-fns";
import { EmailExistsQuery, SigninBody, SignupBody } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository
  ) {}

  @Transactional()
  async signup(input: SignupBody) {
    const unsafeUser = await this.usersRepository.unsafeCreateUser(input);
    const refreshToken = await this.jwtService.signAsync(
      {},
      {
        subject: unsafeUser.uuid,
        noTimestamp: true,
      }
    );
    await this.refreshTokensRepository.createRefreshToken({
      userId: unsafeUser.id,
      token: refreshToken,
      issuedAt: new Date(),
      expiresAt: addDays(new Date(), 7),
    });
    const accessToken = await this.jwtService.signAsync(
      {},
      {
        subject: unsafeUser.uuid,
        expiresIn: "15m",
      }
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async signin(input: SigninBody) {
    const unsafeUser = await this.usersRepository.unsafeGetUser(input);
  }

  async emailExists(input: EmailExistsQuery) {}
}
