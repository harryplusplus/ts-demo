import { User } from "@/entities/user.entity.js";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { CurrentUser, Public } from "./auth-utils.js";
import { RefreshDto, SignDto, TokenResponseDto } from "./auth.dto.js";
import { AuthService } from "./auth.service.js";
import { JwtRefreshAuthGuard } from "./jwt-refresh-auth.guard.js";
import { LocalAuthGuard } from "./local-auth.guard.js";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  @Public()
  async signup(@Body() dto: SignDto) {
    return await this.authService.signup(dto);
  }

  @Post("/signin")
  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignDto })
  @ZodResponse({ type: TokenResponseDto })
  async signin(@CurrentUser() user: User) {
    return await this.authService.signin(user);
  }

  @Post("/refresh")
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @ZodResponse({ type: TokenResponseDto })
  async refresh(@CurrentUser() user: User, @Body() dto: RefreshDto) {
    return await this.authService.refresh({
      user,
      dto,
    });
  }
}
