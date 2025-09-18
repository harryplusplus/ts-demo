import { Controller, Post } from "@nestjs/common";

@Controller("/refresh-tokens")
export class RefreshTokenController {
  @Post("/refresh")
  refresh() {}
}
