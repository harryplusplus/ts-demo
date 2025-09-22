import {
  Body,
  Controller,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ZodResponse } from "nestjs-zod";
import {
  RefreshBodyDto,
  RefreshResponseDto,
  SigninBodyDto,
  SigninResponseDto,
  SignupBodyDto,
  type User,
} from "./auth-types";
import { CurrentUser, Public } from "./auth-utils";
import { AuthService } from "./auth.service";
import { JwtRefreshAuthGuard } from "./jwt-refresh-auth.guard";
import { LocalAuthGuard } from "./local-auth.guard";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup/:id")
  @Public()
  async signup(
    @Param("id")
    id: string,
    @Query() query: SignupBodyDto,
    @Body() body: SignupBodyDto
  ) {
    return await this.authService.signup(body);
  }

  @Post("/signin")
  @Public()
  @UseGuards(LocalAuthGuard)
  @ZodResponse({ type: SigninResponseDto })
  async signin(@CurrentUser() user: User, @Body() _: SigninBodyDto) {
    return await this.authService.signin(user);
  }

  @Post("/refresh")
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @ZodResponse({ type: RefreshResponseDto })
  async refresh(@CurrentUser() user: User, @Body() body: RefreshBodyDto) {
    return await this.authService.refresh({
      user,
      dto: body,
    });
  }
}
