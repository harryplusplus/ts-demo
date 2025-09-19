import { Body, Controller, Post } from "@nestjs/common";
import { ZodResponse } from "nestjs-zod";
import { AuthService } from "./auth.service";
import { SigninResponseDto, SignupBodyDto } from "./auth.types";

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
}
