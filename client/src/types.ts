export type UserRole = "owner" | "mechanic" | "admin";

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};
