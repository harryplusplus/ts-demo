import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async createAccessToken(input: { userUuid: string }) {
    const { userUuid } = input;
    const accessToken = await this.jwtService.signAsync(
      {},
      {
        subject: userUuid,
        expiresIn: "15m",
      }
    );
    return accessToken;
  }

  async createRefreshToken(input: { userUuid: string }) {
    const { userUuid } = input;
    const refreshToken = await this.jwtService.signAsync(
      {},
      {
        subject: userUuid,
        noTimestamp: true,
      }
    );
    return refreshToken;
  }
}
