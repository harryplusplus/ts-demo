import { RefreshToken } from "@/entities/refresh-token.entity.js";
import { User } from "@/entities/user.entity.js";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { addDays } from "date-fns";
import { AuthJwtService } from "./auth-jwt.service.js";
import { JwtPayloadDto, SignDto } from "./auth.dto.js";
import { PasswordHashService } from "./password-hash.service.js";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: EntityRepository<RefreshToken>,
    private readonly authJwtService: AuthJwtService,
    private readonly passwordHashService: PasswordHashService,
    private readonly jwtService: JwtService
  ) {}

  async signup(input: SignDto) {
    const { email, password } = input;
    const passwordHashed = await this.passwordHashService.hash({
      password,
    });
    // TODO
    await this.usersRepository.create({
      email,
      passwordHashed,
    });
  }

  @Transactional()
  async signin(user: User) {
    const refreshToken = await this.refreshTokensRepository.findFirstByUserId({
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
    return await this.createTokens({ user });
  }

  @Transactional()
  async findUserByEmailAndPassword(input: { email: string; password: string }) {
    const { email, password } = input;
    const maybeUser = await this.usersRepository.findUniqueByEmail({
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

  async parseJwtPayload(payload: JwtPayloadDto) {
    const { sub } = payload;
    const user = await this.usersRepository.findUniqueByUuid({ uuid: sub });
    if (!user) {
      throw new UnauthorizedException("Invalid access token.");
    }

    return user;
  }

  @Transactional()
  async refresh(input: { user: User; dto: RefreshBodyDto }) {
    const { user, dto } = input;
    const res = await this.refreshTokensRepository.deleteByToken({
      token: dto.refreshToken,
    });
    if (res.numUpdatedRows === 0n) {
      throw new NotFoundException("Refresh token not found.");
    }
    return await this.createTokens({ user });
  }

  async createTokens(input: { user: User }) {
    const { user } = input;
    const refreshToken = await this.authJwtService.createRefreshToken({
      userUuid: user.uuid,
    });
    const decoded = JwtPayloadDto.schema.parse(
      this.jwtService.decode(refreshToken)
    );
    const issuedAt = new Date(decoded.iat * 1000);
    await this.refreshTokensRepository.create({
      userId: user.id,
      token: refreshToken,
      issuedAt,
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
