import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { UserRole } from "../models/user.model";

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError("Insufficient permissions", 403));
      return;
    }
    next();
  };
};
