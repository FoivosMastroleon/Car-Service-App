import { IReminder } from "../models/reminder.model";
import { ReminderDTO } from "../dto/reminder.dto";

export const toReminderDTO = (reminder: IReminder): ReminderDTO => ({
  id: String(reminder._id),
  vehicle: String(reminder.vehicle),
  maintenanceRule: String(reminder.maintenanceRule),
  status: reminder.status,
  baselineRecord: String(reminder.baselineRecord),
  dismissed: reminder.dismissed,
  dismissedAt: reminder.dismissedAt,
  createdAt: reminder.createdAt,
  updatedAt: reminder.updatedAt,
});

