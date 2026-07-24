import { Schema, model, Document, Types } from 'mongoose';

export type ReminderStatus = "due_soon" | "overdue";

export interface IReminder extends Document {
  vehicle: Types.ObjectId;
  maintenanceRule: Types.ObjectId;
  status: ReminderStatus;
  baselineRecord: Types.ObjectId;
  dismissed: boolean;
  dismissedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reminderSchema = new Schema<IReminder>(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    maintenanceRule: { type: Schema.Types.ObjectId, ref: 'MaintenanceRule', required: true },
    status: { type: String, enum: ["due_soon", "overdue"], required: true },
    baselineRecord: { type: Schema.Types.ObjectId, ref: 'MaintenanceRecord', required: true },
    dismissed: { type: Boolean, required: true, default: false },
    dismissedAt: { type: Date },
  },
  { timestamps: true }
);

reminderSchema.index({ vehicle: 1, maintenanceRule: 1 }, 
    { unique: true, partialFilterExpression: { dismissed: false } }
);

export const ReminderModel = model<IReminder>("Reminder", reminderSchema);