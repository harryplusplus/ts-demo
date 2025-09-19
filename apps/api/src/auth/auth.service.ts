import { RefreshTokensRepository } from "@/refresh-tokens/refresh-tokens.repository";
import { UsersRepository } from "@/users/users.repository";
import { Transactional } from "@nestjs-cls/transactional";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { addDays } from "date-fns";
import { AuthJwtService } from "./auth-jwt.service";
import {
  JwtPayloadDto,
  JwtRefreshAuthInfoDto,
  SignupBodyDto,
  type User,
} from "./auth-types";
import { PasswordHashService } from "./password-hash.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly authJwtService: AuthJwtService,
    private readonly passwordHashService: PasswordHashService
  ) {}

  async signup(input: SignupBodyDto) {
    const { email, password } = input;
    const passwordHashed = await this.passwordHashService.hash({
      password,
    });
    await this.usersRepository.create({
      email,
      passwordHashed,
    });
  }

  @Transactional()
  async signin(user: User) {
    const refreshTokens = await this.refreshTokensRepository.findAllByUserId({
      userId: user.id,
    });

    // NOTE: 데모에서는 단일 리프레시 토큰만 사용함.
    if (refreshTokens.length > 0) {
      const accessToken = await this.authJwtService.createAccessToken({
        userUuid: user.uuid,
      });
      return { accessToken };
    }

    const refreshToken = await this.authJwtService.createRefreshToken({
      userUuid: user.uuid,
    });
    await this.refreshTokensRepository.create({
      userId: user.id,
      token: refreshToken,
      issuedAt: new Date(),
      expiresAt: addDays(new Date(), 7),
    });
    const accessToken = await this.authJwtService.createAccessToken({
      userUuid: user.uuid,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async findUserByEmailAndPassword(input: { email: string; password: string }) {
    const { email, password } = input;
    const maybeUser = await this.usersRepository.findByEmail({
      email,
    });
    if (!maybeUser) {
      throw new UnauthorizedException("Invalid email.");
    }

    const { passwordHashed, ...user } = maybeUser;
    if (
      !(await this.passwordHashService.compare({
        password,
        passwordHashed,
      }))
    ) {
      throw new UnauthorizedException("Invalid password.");
    }

    return user;
  }

  async parseAccessTokenPayload(payload: JwtPayloadDto) {
    const { sub } = payload;
    const user = await this.usersRepository.findByUuid({ uuid: sub });
    if (!user) {
      throw new UnauthorizedException("Invalid access token.");
    }

    return user;
  }

  @Transactional()
  async parseRefreshTokenPayload(input: {
    payload: JwtPayloadDto;
    authInfo: JwtRefreshAuthInfoDto;
  }) {
    const { payload, authInfo } = input;
    const user = await this.usersRepository.findByUuid({ uuid: payload.sub });
    if (!user) {
      throw new UnauthorizedException("Invalid refresh token.");
    }

    const refreshToken = await this.refreshTokensRepository.findByToken({
      token: authInfo.refreshToken,
    });
    if (!refreshToken) {
      throw new UnauthorizedException("Invalid refresh token.");
    }

    if (refreshToken.expiresAt) {
      const now = new Date();
      if (now <= refreshToken.expiresAt) {
        await this.refreshTokensRepository.delete({
          refreshTokenId: refreshToken.id,
        });
        throw new UnauthorizedException("Refresh token expired");
      }
    }

    return user;
  }
}
