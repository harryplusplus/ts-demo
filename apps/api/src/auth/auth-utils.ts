import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from "@nestjs/common";
import { User } from "./auth-types";

export function getJwtSecret() {
  const { JWT_SECRET } = process.env;
  if (!JWT_SECRET) {
    throw new Error("Invalid JWT_SECRET.");
  }

  return JWT_SECRET;
}

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<{ user: User }>();
    return req.user;
  }
);
