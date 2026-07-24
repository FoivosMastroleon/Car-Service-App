import { ReminderModel, IReminder } from "../models/reminder.model";

export const findReminderById = (id: string): Promise<IReminder | null> =>
  ReminderModel.findById(id);

export const findActiveReminderByVehicleAndRule = (
  vehicleId: string,
  ruleId: string
): Promise<IReminder | null> =>
  ReminderModel.findOne({ vehicle: vehicleId, maintenanceRule: ruleId, dismissed: false });

export const findLatestReminderByVehicleAndRule = (
  vehicleId: string,
  ruleId: string
): Promise<IReminder | null> =>
  ReminderModel.findOne({ vehicle: vehicleId, maintenanceRule: ruleId }).sort({ createdAt: -1 });

export const findRemindersByVehicle = (
  vehicleId: string,
  includeDismissed: boolean
): Promise<IReminder[]> =>
  ReminderModel.find({
    vehicle: vehicleId,
    ...(includeDismissed ? {} : { dismissed: false }),
  }).sort({ createdAt: -1 });

export const createReminder = (data: Partial<IReminder>): Promise<IReminder> =>
  ReminderModel.create(data);

export const updateReminder = (id: string, data: Partial<IReminder>): Promise<IReminder | null> =>
  ReminderModel.findByIdAndUpdate(id, data, { new: true });
