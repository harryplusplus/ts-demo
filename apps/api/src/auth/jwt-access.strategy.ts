import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { getJwtSecret } from "./auth-utils";
import { InvalidAccessTokenErrorDto, JwtPayloadDto } from "./auth.dto";
import { AuthService } from "./auth.service";

export const JWT_ACCESS_STRATEGY = "jwt-access";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  JWT_ACCESS_STRATEGY
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getJwtSecret(),
      ignoreExpiration: false,
    });
  }

  async validate(rawPayload: unknown) {
    const payload = await Promise.resolve()
      .then(() => JwtPayloadDto.schema.parse(rawPayload))
      .catch(() => {
        throw new UnauthorizedException(new InvalidAccessTokenErrorDto());
      });

    return await this.authService.parseJwtPayload(payload);
  }
}
