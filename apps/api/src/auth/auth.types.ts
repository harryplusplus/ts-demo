import { z } from "zod";

export const SignupBody = z.object({
  email: z.email(),
  password: z.string(),
});
export type SignupBody = z.infer<typeof SignupBody>;

export const SigninBody = z.object({
  email: z.email(),
  password: z.string(),
});
export type SigninBody = z.infer<typeof SigninBody>;

export const EmailExistsQuery = z.object({
  email: z.email(),
});
export type EmailExistsQuery = z.infer<typeof EmailExistsQuery>;
