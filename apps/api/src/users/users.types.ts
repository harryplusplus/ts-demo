import { SigninBody, SignupBody } from "@/auth/auth.types";

export type UnsafeCreateUserInput = SignupBody;
export type UnsafeGetUserInput = SigninBody;
export type UnsafeGetUserByEmailInput = Omit<UnsafeGetUserInput, "password">;
