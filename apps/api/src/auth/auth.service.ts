// import { UsersService } from "@/users/users.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EmailExistsQuery, SigninBody, SignupBody } from "./auth.types";

@Injectable()
export class AuthService {
  constructor(
    // private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async signup(input: SignupBody) {
    // const user = await this.usersService.createUser(input);
  }

  async signin(input: SigninBody) {}

  async emailExists(input: EmailExistsQuery) {}
}
