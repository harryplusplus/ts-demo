import { createZodDto } from "nestjs-zod/dto";
import z from "zod";
import { ResultError } from "../error.dto.js";

export class EmailSigninDto extends createZodDto(
  z.object({
    email: z.email().meta({ example: "user@email.com" }),
    password: z.string(),
  })
) {}

export class EmailExistsErrorDto implements ResultError {
  message = "The email already exists.";
}

export class InvalidEmailErrorDto implements ResultError {
  resultCode = 1;
  message = "Invalid email.";
}

export class InvalidPasswordErrorDto implements ResultError {
  resultCode = 2;
  message = "Invalid password.";
}

export class InvalidAccessTokenErrorDto implements ResultError {
  message = "Invalid access token.";
}

export class InvalidRefreshTokenErrorDto implements ResultError {
  message = "Invalid refresh token.";
}

export class InvalidUserErrorDto implements ResultError {
  message = "Invalid user.";
}

export class RefreshTokenNotFoundErrorDto implements ResultError {
  message = "Refresh token not found.";
}

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
