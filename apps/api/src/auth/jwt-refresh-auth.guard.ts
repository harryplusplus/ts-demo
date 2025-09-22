import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JWT_REFRESH_STRATEGY } from "./jwt-refresh.strategy";

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard(JWT_REFRESH_STRATEGY) {}
