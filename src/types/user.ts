export type PUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  likedByUser?: boolean;
};

export type PUserCreateInput = Omit<PUser, "id" | "createdAt" | "updatedAt">;