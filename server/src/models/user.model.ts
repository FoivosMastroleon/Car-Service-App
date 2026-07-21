import { Schema, model, Document } from 'mongoose';

export type UserRole = 'admin' | 'owner' | 'mechanic';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'owner', 'mechanic'], required: true },
}, { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);
