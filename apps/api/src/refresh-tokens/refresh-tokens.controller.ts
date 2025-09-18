import { Controller, Post } from "@nestjs/common";

@Controller("/refresh-tokens")
export class RefreshTokensController {
  @Post("/refresh")
  refresh() {}
}
