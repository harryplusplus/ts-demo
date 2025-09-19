import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export class SignupBodyDto extends createZodDto(
  z.object({
    email: z.email(),
    password: z.string(),
  })
) {}

export class SigninBodyDto extends createZodDto(
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
