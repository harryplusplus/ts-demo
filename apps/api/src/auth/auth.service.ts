import { RefreshTokensRepository } from "@/refresh-tokens/refresh-tokens.repository";
import { UsersRepository } from "@/users/users.repository";
import { compare, hash } from "@/utils/hash";
import { Transactional } from "@nestjs-cls/transactional";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
    const { email, password } = input;
    const passwordHashed = await hash(password);
    await this.usersRepository.createUser({
      email,
      passwordHashed,
    });
  }

  @Transactional()
  async signin(input: SigninBody) {
    const { email, password } = input;
    const userWithSensitiveData =
      await this.usersRepository.findUserWithSensitiveDataByEmail({ email });
    const matched = await compare(
      password,
      userWithSensitiveData.passwordHashed
    );
    if (!matched) {
      throw new BadRequestException("Invalid password.");
    }

    const refreshTokens =
      await this.refreshTokensRepository.findAllRefreshTokensByUserId({
        userId: userWithSensitiveData.id,
      });

    // NOTE: 데모에서는 단일 리프레시 토큰만 사용함.
    if (refreshTokens.length > 0) {
      const accessToken = await this.createAccessToken({
        userUuid: userWithSensitiveData.uuid,
      });
      return { accessToken };
    }

    const refreshToken = await this.createRefreshToken({
      userUuid: userWithSensitiveData.uuid,
    });
    await this.refreshTokensRepository.createRefreshToken({
      userId: userWithSensitiveData.id,
      token: refreshToken,
      issuedAt: new Date(),
      expiresAt: addDays(new Date(), 7),
    });
    const accessToken = await this.createAccessToken({
      userUuid: userWithSensitiveData.uuid,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createAccessToken(input: { userUuid: string }) {
    const { userUuid } = input;
    const accessToken = await this.jwtService.signAsync(
      {},
      {
        subject: userUuid,
        expiresIn: "15m",
      }
    );
    return accessToken;
  }

  private async createRefreshToken(input: { userUuid: string }) {
    const { userUuid } = input;
    const refreshToken = await this.jwtService.signAsync(
      {},
      {
        subject: userUuid,
        noTimestamp: true,
      }
    );
    return refreshToken;
  }

  async emailExists(input: EmailExistsQuery) {
    const { email } = input;
    try {
      await this.usersRepository.findUserWithSensitiveDataByEmail({
        email,
      });
      return true;
    } catch (e) {
      if (e instanceof NotFoundException) {
        return false;
      }

      throw e;
    }
  }
}
