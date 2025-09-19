import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class SignupBodyDto extends createZodDto(
  z.object({
    email: z.email(),
    password: z.string(),
  })
) {}

export class SigninResponseDto extends createZodDto(
  z.object({
    accessToken: z.string(),
    refreshToken: z.optional(z.string()),
  })
) {}

export type User = {
  id: string;
  uuid: string;
};

export class JwtRefreshAuthInfoDto extends createZodDto(
  z.object({
    refreshToken: z.string(),
  })
) {}

export class JwtPayloadDto extends createZodDto(
  z.object({
    sub: z.string(),
  })
) {}
