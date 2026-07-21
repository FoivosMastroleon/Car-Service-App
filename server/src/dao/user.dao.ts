import { UserModel, IUser } from "../models/user.model";

export const findUserByEmail = (email: string): Promise<IUser | null> =>
  UserModel.findOne({ email });

export const findUserByUsername = (username: string): Promise<IUser | null> =>
  UserModel.findOne({ username });

export const findUserById = (id: string): Promise<IUser | null> =>
  UserModel.findById(id);

export const findAllUsers = (): Promise<IUser[]> => UserModel.find();

export const createUser = (data: {
  username: string;
  email: string;
  password: string;
  role: IUser["role"];
}): Promise<IUser> => UserModel.create(data);

export const updateUser = (id: string, data: Partial<IUser>): Promise<IUser | null> =>
  UserModel.findByIdAndUpdate(id, data, { new: true });

export const deleteUser = (id: string): Promise<IUser | null> =>
  UserModel.findByIdAndDelete(id);
