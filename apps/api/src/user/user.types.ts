import { z } from "zod";

export const SignupDto = z.object({
  email: z.email(),
  password: z.string(),
});
export type SignupDto = z.infer<typeof SignupDto>;

export const SigninDto = z.object({
  email: z.email(),
  password: z.string(),
});
export type SigninDto = z.infer<typeof SigninDto>;
