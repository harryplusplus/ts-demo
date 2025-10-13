import { Transactional } from "@mikro-orm/postgresql";
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { addDays } from "date-fns";
import { RefreshTokenService } from "../refresh-token/refresh-token.service.js";
import { User } from "../user/user.entity.js";
import { UserService } from "../user/user.service.js";
import { AuthJwtService } from "./auth-jwt.service.js";
import {
  EmailExistsErrorDto,
  EmailSigninDto,
  InvalidEmailErrorDto,
  InvalidPasswordErrorDto,
  InvalidUserErrorDto,
  JwtPayloadDto,
  RefreshDto,
  RefreshTokenNotFoundErrorDto,
} from "./auth.dto.js";
import { PasswordHashService } from "./password-hash.service.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly authJwtService: AuthJwtService,
    private readonly passwordHashService: PasswordHashService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  async signup(dto: EmailSigninDto) {
    const { email, password } = dto;
    const passwordHashed = await this.passwordHashService.hash({
      password,
    });
    try {
      this.userService.createUser({ email, passwordHashed });
    } catch (e) {
      // if (
      //   e instanceof QueryFailedError &&
      //   "code" in e &&
      //   e.code === "23505" &&
      //   "constraint" in e &&
      //   e.constraint === "users_email_unique"
      // ) {
      //
      // }
      console.error(e);
      throw new ConflictException(new EmailExistsErrorDto());
    }
  }

  @Transactional()
  async signin(user: User) {
    // NOTE: 데모에서는 단일 리프레시 토큰만 사용함.
    if (await this.refreshTokenService.existsNotExpired({ userId: user.id })) {
      const accessToken = await this.authJwtService.createAccessToken({
        userUuid: user.uuid,
      });
      return { accessToken };
    }

    // 최초 로그인 또는 리프레시 토큰 만료 후 로그인
    const res = await this.createTokens({ user });
    return {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken.token,
    };
  }

  @Transactional()
  async parseEmailAndPassword(dto: EmailSigninDto) {
    const { email, password } = dto;
    const user = await this.userService.findByEmail({ email });
    if (!user) {
      throw new UnauthorizedException(new InvalidEmailErrorDto());
    }

    if (
      !(await this.passwordHashService.compare({
        password,
        passwordHashed: user.passwordHashed,
      }))
    ) {
      throw new UnauthorizedException(new InvalidPasswordErrorDto());
    }

    return user;
  }

  @Transactional()
  async parseJwtPayload(dto: JwtPayloadDto) {
    const { sub } = dto;
    const user = await this.userService.findByUuid({ uuid: sub });
    if (!user) {
      throw new UnauthorizedException(new InvalidUserErrorDto());
    }

    return user;
  }

  @Transactional()
  async refresh(input: { user: User; dto: RefreshDto }) {
    const { user, dto } = input;
    if (
      !(await this.refreshTokenService.deleteByToken({
        token: dto.refreshToken,
      }))
    ) {
      throw new NotFoundException(new RefreshTokenNotFoundErrorDto());
    }

    const createRes = await this.createTokens({ user });
    return {
      accessToken: createRes.accessToken,
      refreshToken: createRes.refreshToken.token,
    };
  }

  @Transactional()
  async createTokens(input: { user: User }) {
    const { user } = input;
    const refreshToken = await this.createRefreshToken({
      userUuid: user.uuid,
      userId: user.id,
    });
    const accessToken = await this.authJwtService.createAccessToken({
      userUuid: user.uuid,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  @Transactional()
  async createRefreshToken(input: { userUuid: string; userId: string }) {
    const { userId, userUuid } = input;
    const token = await this.authJwtService.createRefreshToken({
      userUuid,
    });
    return this.refreshTokenService.createRefreshToken({
      userId,
      token,
      expiresAt: addDays(new Date(), 7),
    });
  }
}
