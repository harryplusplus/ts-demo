import { RefreshTokenRepository } from "@/refresh-token/refresh-token.repository";
import { User } from "@/user/user.entity";
import { UserRepository } from "@/user/user.repository";
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { addDays } from "date-fns";
import { QueryFailedError } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { AuthJwtService } from "./auth-jwt.service";
import {
  EmailExistsErrorDto,
  EmailSigninDto,
  InvalidEmailErrorDto,
  InvalidPasswordErrorDto,
  InvalidUserErrorDto,
  JwtPayloadDto,
  RefreshDto,
  RefreshTokenNotFoundErrorDto,
} from "./auth.dto";
import { PasswordHashService } from "./password-hash.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly authJwtService: AuthJwtService,
    private readonly passwordHashService: PasswordHashService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}

  async signup(dto: EmailSigninDto) {
    const { email, password } = dto;
    const passwordHashed = await this.passwordHashService.hash({
      password,
    });
    try {
      await this.userRepository.createEntity({ email, passwordHashed });
    } catch (e) {
      if (
        e instanceof QueryFailedError &&
        "code" in e &&
        e.code === "23505" &&
        "constraint" in e &&
        e.constraint === "uq_users_email"
      ) {
        throw new ConflictException(new EmailExistsErrorDto());
      }

      throw e;
    }
  }

  @Transactional()
  async signin(user: User) {
    const refreshToken = await this.refreshTokenRepository.findOneBy({
      userId: user.id,
    });

    // NOTE: 데모에서는 단일 리프레시 토큰만 사용함.
    if (refreshToken) {
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

  async parseEmailAndPassword(dto: EmailSigninDto) {
    const { email, password } = dto;
    const user = await this.userRepository.findOneBy({ email });
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

  async parseJwtPayload(dto: JwtPayloadDto) {
    const { sub } = dto;
    const user = await this.userRepository.findOneBy({ uuid: sub });
    if (!user) {
      throw new UnauthorizedException(new InvalidUserErrorDto());
    }

    return user;
  }

  @Transactional()
  async refresh(input: { user: User; dto: RefreshDto }) {
    const { user, dto } = input;
    const deleteRes = await this.refreshTokenRepository.softDelete({
      token: dto.refreshToken,
    });
    if (deleteRes.affected !== 1) {
      throw new NotFoundException(new RefreshTokenNotFoundErrorDto());
    }

    const createRes = await this.createTokens({ user });
    return {
      accessToken: createRes.accessToken,
      refreshToken: createRes.refreshToken.token,
    };
  }

  async createTokens(input: { user: User }) {
    const { user } = input;
    const refreshTokenString = await this.authJwtService.createRefreshToken({
      userUuid: user.uuid,
    });
    const decoded = JwtPayloadDto.schema.parse(
      this.jwtService.decode(refreshTokenString)
    );
    const issuedAt = new Date(decoded.iat * 1000);
    const refreshToken = await this.refreshTokenRepository.createEntity({
      userId: user.id,
      token: refreshTokenString,
      expiresAt: addDays(issuedAt, 7),
    });
    const accessToken = await this.authJwtService.createAccessToken({
      userUuid: user.uuid,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
