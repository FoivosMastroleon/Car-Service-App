import * as reminderDao from "../dao/reminder.dao";
import * as vehicleDao from "../dao/vehicle.dao";
import * as maintenanceStatusService from "./maintenanceStatus.service";
import { toReminderDTO } from "../mappers/reminder.mapper";
import { AppError } from "../utils/AppError";
import { UserRole } from "../models/user.model";
import { ReminderStatus } from "../models/reminder.model";
import { Types } from "mongoose";

const getOwnedVehicleOrThrow = async (
  vehicleId: string,
  requester: { userId: string; role: UserRole }
) => {
  const vehicle = await vehicleDao.findVehicleById(vehicleId);
  if (!vehicle) throw new AppError("Vehicle not found", 404);

  if (requester.role !== "admin" && String(vehicle.owner) !== requester.userId) {
    throw new AppError("Insufficient permissions", 403);
  }

  return vehicle;
};

const STATUS_SEVERITY: Record<ReminderStatus, number> = { due_soon: 0, overdue: 1 };

const syncRemindersForVehicle = async (
  vehicleId: string,
  requester: { userId: string; role: UserRole }
) => {
  const statuses = await maintenanceStatusService.getMaintenanceStatusForVehicle(vehicleId, requester);

  for (const status of statuses) {
    const isDue = status.status === "due_soon" || status.status === "overdue";
    const latestReminder = await reminderDao.findLatestReminderByVehicleAndRule(vehicleId, status.ruleId);

    if (!isDue) {
      if (latestReminder && !latestReminder.dismissed) {
        await reminderDao.updateReminder(String(latestReminder._id), {
          dismissed: true,
          dismissedAt: new Date(),
        });
      }
      continue;
    }

    const newStatus = status.status as ReminderStatus;
    const newBaselineRecord = status.lastRecordId!;

    if (!latestReminder) {
      await reminderDao.createReminder({
        vehicle: new Types.ObjectId(vehicleId),
        maintenanceRule: new Types.ObjectId(status.ruleId),
        status: newStatus,
        baselineRecord: new Types.ObjectId(newBaselineRecord),
        dismissed: false,
      });
      continue;
    }

    if (!latestReminder.dismissed) {
      if (STATUS_SEVERITY[newStatus] > STATUS_SEVERITY[latestReminder.status]) {
        await reminderDao.updateReminder(String(latestReminder._id), { status: newStatus });
      }
      continue;
    }

    const isNewCycle = String(latestReminder.baselineRecord) !== newBaselineRecord;
    const isEscalation = STATUS_SEVERITY[newStatus] > STATUS_SEVERITY[latestReminder.status];

    if (isNewCycle || isEscalation) {
      await reminderDao.createReminder({
        vehicle: new Types.ObjectId(vehicleId),
        maintenanceRule: new Types.ObjectId(status.ruleId),
        status: newStatus,
        baselineRecord: new Types.ObjectId(newBaselineRecord),
        dismissed: false,
      });
    }
  }
};

export const getRemindersForVehicle = async (
  vehicleId: string,
  requester: { userId: string; role: UserRole },
  includeDismissed: boolean
) => {
  await getOwnedVehicleOrThrow(vehicleId, requester);
  await syncRemindersForVehicle(vehicleId, requester);

  const reminders = await reminderDao.findRemindersByVehicle(vehicleId, includeDismissed);
  return reminders.map(toReminderDTO);
};

export const dismissReminder = async (
  id: string,
  requester: { userId: string; role: UserRole }
) => {
  const reminder = await reminderDao.findReminderById(id);
  if (!reminder) throw new AppError("Reminder not found", 404);

  await getOwnedVehicleOrThrow(String(reminder.vehicle), requester);

  if (reminder.dismissed) throw new AppError("Reminder already dismissed", 400);

  const updated = await reminderDao.updateReminder(id, {
    dismissed: true,
    dismissedAt: new Date(),
  });

  return toReminderDTO(updated!);
};
