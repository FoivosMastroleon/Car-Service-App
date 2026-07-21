import { UserRole } from "../models/user.model";

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}