import { Schema, model, Document, Types } from "mongoose";

export type FuelType = "petrol" | "diesel" | "hybrid" | "electric" | "lpg";

export interface IVehicle extends Omit<Document, "model">{
  owner: Types.ObjectId;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  mileage: number;
  color?: string;
  fuelType: FuelType;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    licensePlate: { type: String, required: true, unique: true },
    vin: { type: String },
    mileage: { type: Number, required: true, default: 0 },
    color: { type: String },
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "hybrid", "electric", "lpg"],
      required: true,
    },
    photo: { type: String },
  },
  { timestamps: true }
);

export const VehicleModel = model<IVehicle>("Vehicle", vehicleSchema);
