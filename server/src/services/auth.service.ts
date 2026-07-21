import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userDao from "../dao/user.dao";
import { toUserDTO } from "../mappers/user.mapper";
import { AppError } from "../utils/AppError";
import { RegisterInput, LoginInput } from "../validators/auth.validator";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

const signToken = (userId: string, role: string) =>
  jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });

export const register = async (input: RegisterInput) => {
  const existingEmail = await userDao.findUserByEmail(input.email);
  if (existingEmail) throw new AppError("Email already in use", 409);

  const existingUsername = await userDao.findUserByUsername(input.username);
  if (existingUsername) throw new AppError("Username already taken", 409);

  const hashed = await bcrypt.hash(input.password, 10);
  const user = await userDao.createUser({ ...input, password: hashed });

  const token = signToken(String(user._id), user.role);
  return { user: toUserDTO(user), token };
};

export const login = async (input: LoginInput) => {
  const user = await userDao.findUserByEmail(input.email);
  if (!user) throw new AppError("Invalid credentials", 401);

  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid) throw new AppError("Invalid credentials", 401);

  const token = signToken(String(user._id), user.role);
  return { user: toUserDTO(user), token };
};

export const getMe = async (userId: string) => {
  const user = await userDao.findUserById(userId);
  if (!user) throw new AppError("User not found", 404);
  return toUserDTO(user);
};