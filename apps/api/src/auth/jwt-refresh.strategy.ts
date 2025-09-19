import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { JwtPayloadDto, JwtRefreshAuthInfoDto } from "./auth-types";
import { getJwtSecret } from "./auth-utils";
import { AuthService } from "./auth.service";

export const JWT_REFRESH_STRATEGY = "jwt-refresh";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_STRATEGY
) {
  constructor(private authService: AuthService) {
    super({
      ignoreExpiration: true,
      secretOrKey: getJwtSecret(),
      passReqToCallback: true,
      jwtFromRequest: (req: Request) => {
        const { authorization } = req.headers;
        if (authorization) {
          const [scheme, token] = authorization.split(" ");
          if (scheme?.toLowerCase() === "refresh" && token) {
            const authInfo: JwtRefreshAuthInfoDto = {
              refreshToken: token,
            };
            req.authInfo = authInfo;
            return token;
          }
        }
        return null;
      },
    });
  }

  async validate(req: Request, rawPayload: unknown) {
    const authInfo = JwtRefreshAuthInfoDto.schema.parse(req.authInfo);
    const payload = JwtPayloadDto.schema.parse(rawPayload);
    return await this.authService.parseRefreshTokenPayload({
      authInfo,
      payload,
    });
  }
}
