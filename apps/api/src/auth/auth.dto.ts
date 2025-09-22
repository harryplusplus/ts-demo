import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class SignDto extends createZodDto(
  z.object({
    email: z.email().meta({ examples: ["user@mail.com"] }),
    password: z.string(),
  })
) {}

export class TokenResponseDto extends createZodDto(
  z.object({
    accessToken: z.string(),
    refreshToken: z.string().optional(),
  })
) {}

export class RefreshDto extends createZodDto(
  z.object({
    refreshToken: z.string(),
  })
) {}

export class JwtPayloadDto extends createZodDto(
  z.object({
    sub: z.string(),
    iat: z.number(),
  })
) {}
