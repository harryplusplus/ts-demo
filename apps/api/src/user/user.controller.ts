import { ZodPipe } from "@/utils/zod.pipe";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { SigninDto, SignupDto } from "./user.types";

@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/signup")
  async signup(@Body(new ZodPipe(SignupDto)) body: SignupDto) {
    return await this.userService.signup(body);
  }

  @Post("/signin")
  async signin(@Body(new ZodPipe(SigninDto)) body: SigninDto) {
    return await this.userService.signin(body);
  }

  @Get("/email-exists")
  async emailExists(@Query("email") email: string) {
    return await this.userService.emailExists({ email });
  }
}
