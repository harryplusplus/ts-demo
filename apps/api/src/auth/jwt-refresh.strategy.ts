import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { getJwtSecret } from "./auth-utils.js";
import { AuthService } from "./auth.service.js";

export const JWT_REFRESH_STRATEGY = "jwt-refresh";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_STRATEGY
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
      secretOrKey: getJwtSecret(),
      ignoreExpiration: true,
    });
  }

  async validate(rawPayload: unknown) {
    const payload = JwtPayloadDto.schema.parse(rawPayload);
    return await this.authService.parseJwtPayload(payload);
  }
}
