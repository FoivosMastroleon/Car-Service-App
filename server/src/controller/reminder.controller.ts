import { Request, Response, NextFunction } from "express";
import * as reminderService from "../services/reminder.service";

export const getRemindersForVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeDismissed = req.query.includeDismissed === "true";
    const reminders = await reminderService.getRemindersForVehicle(
      req.params.vehicleId as string,
      req.user!,
      includeDismissed
    );
    res.status(200).json(reminders);
  } catch (error) {
    next(error);
  }
};

export const dismissReminder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reminder = await reminderService.dismissReminder(req.params.id as string, req.user!);
    res.status(200).json(reminder);
  } catch (error) {
    next(error);
  }
};
