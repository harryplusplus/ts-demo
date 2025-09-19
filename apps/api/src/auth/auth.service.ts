import { RefreshTokensRepository } from "@/refresh-tokens/refresh-tokens.repository";
import { UsersRepository } from "@/users/users.repository";
import { Transactional } from "@nestjs-cls/transactional";
import { BadRequestException, Injectable } from "@nestjs/common";
import { addDays } from "date-fns";
import { AuthHashService } from "./auth-hash.service";
import { AuthJwtService } from "./auth-jwt.service";
import { SigninBodyDto, SignupBodyDto } from "./auth-types";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly authJwtService: AuthJwtService,
    private readonly authHashService: AuthHashService
  ) {}

  async signup(input: SignupBodyDto) {
    const { email, password } = input;
    const passwordHashed = await this.authHashService.hashPassword({
      password,
    });
    await this.usersRepository.createUser({
      email,
      passwordHashed,
    });
  }

  @Transactional()
  async signin(input: SigninBodyDto) {
    const { email, password } = input;
    const userWithSensitiveData =
      await this.usersRepository.findUserWithSensitiveDataByEmail({ email });
    const matched = await this.authHashService.comparePassword({
      password,
      passwordHashed: userWithSensitiveData.passwordHashed,
    });
    if (!matched) {
      throw new BadRequestException("Invalid password.");
    }

    const refreshTokens =
      await this.refreshTokensRepository.findAllRefreshTokensByUserId({
        userId: userWithSensitiveData.id,
      });

    // NOTE: 데모에서는 단일 리프레시 토큰만 사용함.
    if (refreshTokens.length > 0) {
      const accessToken = await this.authJwtService.createAccessToken({
        userUuid: userWithSensitiveData.uuid,
      });
      return { accessToken };
    }

    const refreshToken = await this.authJwtService.createRefreshToken({
      userUuid: userWithSensitiveData.uuid,
    });
    await this.refreshTokensRepository.createRefreshToken({
      userId: userWithSensitiveData.id,
      token: refreshToken,
      issuedAt: new Date(),
      expiresAt: addDays(new Date(), 7),
    });
    const accessToken = await this.authJwtService.createAccessToken({
      userUuid: userWithSensitiveData.uuid,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
