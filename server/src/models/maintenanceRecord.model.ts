import { Schema, model, Document, Types } from "mongoose";

export interface IMaintenanceRecord extends Document {
  vehicle: Types.ObjectId;
  maintenanceType: Types.ObjectId;
  performedAt: Date;
  mileageAtService: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceRecordSchema = new Schema<IMaintenanceRecord>(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    maintenanceType: {
      type: Schema.Types.ObjectId,
      ref: "MaintenanceType",
      required: true,
    },
    performedAt: { type: Date, required: true },
    mileageAtService: { type: Number, required: true, min: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export const MaintenanceRecordModel = model<IMaintenanceRecord>(
  "MaintenanceRecord",
  maintenanceRecordSchema
);