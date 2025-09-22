import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { getJwtSecret } from "./auth-utils.js";
import { JwtPayloadDto } from "./auth.dto.js";
import { AuthService } from "./auth.service.js";

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
    const payload = JwtPayloadDto.schema.parse(rawPayload);
    return await this.authService.parseJwtPayload(payload);
  }
}
