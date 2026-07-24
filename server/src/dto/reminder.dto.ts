import { ReminderStatus } from "../models/reminder.model";

export interface ReminderDTO {
  id: string;
  vehicle: string;
  maintenanceRule: string;
  status: ReminderStatus;
  baselineRecord: string;
  dismissed: boolean;
  dismissedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
