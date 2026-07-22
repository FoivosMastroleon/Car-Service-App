import { Schema, model, Document } from "mongoose";

export interface IMaintenanceType extends Document {
  name: string;
  description?: string;
  defaultIntervalKm?: number;
  defaultIntervalMonths?: number;
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceTypeSchema = new Schema<IMaintenanceType>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    defaultIntervalKm: { type: Number },
    defaultIntervalMonths: { type: Number },
  },
  { timestamps: true }
);

export const MaintenanceTypeModel = model<IMaintenanceType>(
  "MaintenanceType",
  maintenanceTypeSchema
);
