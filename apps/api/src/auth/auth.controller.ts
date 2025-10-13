import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { User } from "../user/user.entity.js";
import { CurrentUser, Public } from "./auth-utils.js";
import {
  EmailExistsErrorDto,
  EmailSigninDto,
  InvalidEmailErrorDto,
  InvalidPasswordErrorDto,
  InvalidRefreshTokenErrorDto,
  InvalidUserErrorDto,
  RefreshDto,
  RefreshTokenNotFoundErrorDto,
  TokenResponseDto,
} from "./auth.dto.js";
import { AuthService } from "./auth.service.js";
import { JwtRefreshAuthGuard } from "./jwt-refresh-auth.guard.js";
import { LocalAuthGuard } from "./local-auth.guard.js";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  @ApiOperation({ summary: "회원가입" })
  @ApiCreatedResponse({ description: "성공" })
  @ApiConflictResponse({
    description: "이메일 중복",
    type: EmailExistsErrorDto,
  })
  @Public()
  async signup(@Body() dto: EmailSigninDto) {
    return await this.authService.signup(dto);
  }

  @Post("/signin")
  @ApiOperation({ summary: "로그인" })
  @ApiBody({ type: EmailSigninDto })
  @ApiUnauthorizedResponse({
    description: "인증 실패",
    examples: {
      invalidEmail: {
        summary: "잘못된 이메일",
        value: new InvalidEmailErrorDto(),
      },
      invalidPassword: {
        summary: "잘못된 비밀번호",
        value: new InvalidPasswordErrorDto(),
      },
    },
  })
  @ZodResponse({
    status: 201,
    description: "성공",
    type: TokenResponseDto,
  })
  @Public()
  @UseGuards(LocalAuthGuard)
  async signin(@CurrentUser() user: User) {
    return await this.authService.signin(user);
  }

  @Post("/refresh")
  @ApiOperation({ summary: "리프레시 토큰 갱신" })
  @ApiUnauthorizedResponse({
    description: "인증 실패",
    examples: {
      invalidRefreshToken: {
        summary: "잘못된 리프레시 토큰",
        value: new InvalidRefreshTokenErrorDto(),
      },
      invalidUser: {
        summary: "잘못된 사용자",
        value: new InvalidUserErrorDto(),
      },
    },
  })
  @ApiNotFoundResponse({
    description: "리프레시 토큰 찾기 실패",
    type: RefreshTokenNotFoundErrorDto,
  })
  @ZodResponse({ status: 201, description: "성공", type: TokenResponseDto })
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(@CurrentUser() user: User, @Body() dto: RefreshDto) {
    return await this.authService.refresh({ user, dto });
  }
}
