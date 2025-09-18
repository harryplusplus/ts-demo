import { ZodPipe } from "@/utils/zod.pipe";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { EmailExistsQuery, SigninBody, SignupBody } from "./auth.types";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  async signup(@Body(new ZodPipe(SignupBody)) body: SignupBody) {
    return await this.authService.signup(body);
  }

  @Post("/signin")
  async signin(@Body(new ZodPipe(SigninBody)) body: SigninBody) {
    return await this.authService.signin(body);
  }

  @Get("/email-exists")
  async emailExists(
    @Query(new ZodPipe(EmailExistsQuery)) query: EmailExistsQuery
  ) {
    return await this.authService.emailExists(query);
  }
}
