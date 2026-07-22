import { Schema, model, Document, Types } from "mongoose";

export interface IMaintenanceRule extends Document {
  vehicle: Types.ObjectId;
  maintenanceType: Types.ObjectId;
  intervalKm?: number;
  intervalMonths?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const maintenanceRuleSchema = new Schema<IMaintenanceRule>(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    maintenanceType: {
      type: Schema.Types.ObjectId,
      ref: "MaintenanceType",
      required: true,
    },
    intervalKm: { type: Number },
    intervalMonths: { type: Number },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

maintenanceRuleSchema.index({ vehicle: 1, maintenanceType: 1 }, { unique: true });

export const MaintenanceRuleModel = model<IMaintenanceRule>(
  "MaintenanceRule",
  maintenanceRuleSchema
);
