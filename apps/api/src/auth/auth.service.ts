import { RefreshToken } from "@/entities/refresh-token.entity.js";
import { User } from "@/entities/user.entity.js";
import { EntityManager, Transactional } from "@mikro-orm/postgresql";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { addDays } from "date-fns";
import { AuthJwtService } from "./auth-jwt.service.js";
import { JwtPayloadDto, RefreshDto, SignDto } from "./auth.dto.js";
import { PasswordHashService } from "./password-hash.service.js";

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly authJwtService: AuthJwtService,
    private readonly passwordHashService: PasswordHashService,
    private readonly jwtService: JwtService
  ) {}

  async signup(input: SignDto) {
    const { email, password } = input;
    const passwordHashed = await this.passwordHashService.hash({
      password,
    });
    const user = this.em.create(User, { email, passwordHashed });
    await this.em.persist(user).flush();
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

  async findUserByEmailAndPassword(input: { email: string; password: string }) {
    const { email, password } = input;
    const user = await this.em.findOne(User, { email });
    if (!user) {
      throw new UnauthorizedException("Invalid email.");
    }

    if (
      !(await this.passwordHashService.compare({
        password,
        passwordHashed: user.passwordHashed,
      }))
    ) {
      throw new UnauthorizedException("Invalid password.");
    }

    return user;
  }

  async parseJwtPayload(dto: JwtPayloadDto) {
    const { sub } = dto;
    const user = await this.em.findOne(User, { uuid: sub });
    if (!user) {
      throw new UnauthorizedException("Invalid access token.");
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
      throw new NotFoundException("Refresh token not found.");
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
    const refreshToken = this.em.create(RefreshToken, {
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
