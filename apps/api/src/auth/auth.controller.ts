import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ZodResponse } from "nestjs-zod";
import { SigninResponseDto, SignupBodyDto, type User } from "./auth-types";
import { CurrentUser, Public } from "./auth-utils";
import { AuthService } from "./auth.service";
import { JwtRefreshAuthGuard } from "./jwt-refresh-auth.guard";
import { LocalAuthGuard } from "./local-auth.guard";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  @Public()
  async signup(@Body() body: SignupBodyDto) {
    return await this.authService.signup(body);
  }

  @Post("/signin")
  @Public()
  @UseGuards(LocalAuthGuard)
  @ZodResponse({ type: SigninResponseDto })
  async signin(@CurrentUser() user: User) {
    return await this.authService.signin(user);
  }

  @Post("/refresh")
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  async refresh() {}
}
