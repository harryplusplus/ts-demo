import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ZodResponse } from "nestjs-zod";
import { AuthService } from "./auth.service";
import {
  EmailExistsQueryDto,
  EmailExistsResponseDto,
  SigninResponseDto,
  SignupBodyDto,
} from "./auth.types";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  async signup(@Body() body: SignupBodyDto) {
    return await this.authService.signup(body);
  }

  @Post("/signin")
  @ZodResponse({ type: SigninResponseDto })
  async signin(@Body() body: SignupBodyDto) {
    return await this.authService.signin(body);
  }

  @Get("/email-exists")
  @ZodResponse({ type: EmailExistsResponseDto })
  async emailExists(@Query() query: EmailExistsQueryDto) {
    return await this.authService.emailExists(query);
  }
}
