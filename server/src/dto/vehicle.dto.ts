import { FuelType } from "../models/vehicle.model";

export interface VehicleDTO {
  id: string;
  owner: string;
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
