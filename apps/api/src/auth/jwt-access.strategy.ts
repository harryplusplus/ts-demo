import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayloadDto } from "./auth-types";
import { getJwtSecret } from "./auth-utils";
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
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(rawPayload: unknown) {
    const payload = JwtPayloadDto.schema.parse(rawPayload);
    return await this.authService.parseAccessTokenPayload(payload);
  }
}
