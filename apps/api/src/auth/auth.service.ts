import { RefreshToken } from "@/entities/refresh-token.entity";
import { User } from "@/entities/user.entity";
import {
  EntityManager,
  Transactional,
  UniqueConstraintViolationException,
} from "@mikro-orm/postgresql";
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { addDays } from "date-fns";
import { AuthJwtService } from "./auth-jwt.service";
import {
  EmailExistsErrorDto,
  InvalidEmailErrorDto,
  InvalidPasswordErrorDto,
  InvalidUserErrorDto,
  JwtPayloadDto,
  RefreshDto,
  RefreshTokenNotFoundErrorDto,
  SignInfoDto,
} from "./auth.dto";
import { PasswordHashService } from "./password-hash.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly authJwtService: AuthJwtService,
    private readonly passwordHashService: PasswordHashService,
    private readonly jwtService: JwtService
  ) {}

  async signup(dto: SignInfoDto) {
    const { email, password } = dto;
    const passwordHashed = await this.passwordHashService.hash({
      password,
    });
    const user = new User({ email, passwordHashed });
    this.em.persist(user);
    try {
      await this.em.flush();
    } catch (e) {
      if (
        e instanceof UniqueConstraintViolationException &&
        e.code === "23505" &&
        "constraint" in e &&
        e.constraint === "user_email_unique"
      ) {
        throw new ConflictException(new EmailExistsErrorDto());
      }

      throw e;
    }
  }

  @Transactional()
  async signin(user: User) {
    const refreshToken = await this.em.findOne(RefreshToken, { user });

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

  async findUserByEmailAndPassword(dto: { email: string; password: string }) {
    const { email, password } = dto;
    const user = await this.em.findOne(User, { email });
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
    const user = await this.em.findOne(User, { uuid: sub });
    if (!user) {
      throw new UnauthorizedException(new InvalidUserErrorDto());
    }

    return user;
  }

  @Transactional()
  async refresh(input: { user: User; dto: RefreshDto }) {
    const { user, dto } = input;
    const count = await this.em.nativeUpdate(
      RefreshToken,
      { token: dto.refreshToken, deletedAt: null },
      { deletedAt: new Date() }
    );
    if (count === 0) {
      throw new NotFoundException(new RefreshTokenNotFoundErrorDto());
    }
    const res = await this.createTokens({ user });
    return {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken.token,
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
    const refreshToken = new RefreshToken({
      user,
      token: refreshTokenString,
      expiresAt: addDays(issuedAt, 7),
      createdAt: issuedAt,
    });
    this.em.persist(refreshToken);
    const accessToken = await this.authJwtService.createAccessToken({
      userUuid: user.uuid,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
