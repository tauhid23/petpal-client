import type { PUser, PUserCreateInput } from "../types/user";

export type PLoginInput = {
  email: string;
  password: string;
};

export type PRegisterInput = PUserCreateInput; // Reuse User creation type

export type PAuthResponse = {
  user: Omit<PUser, "password">; // Don't send password to frontend
  token: string;
};