import { IVehicle } from "../models/vehicle.model";
import { VehicleDTO } from "../dto/vehicle.dto";

export const toVehicleDTO = (vehicle: IVehicle): VehicleDTO => ({
  id: String(vehicle._id),
  owner: String(vehicle.owner),
  make: vehicle.make,
  model: vehicle.model,
  year: vehicle.year,
  licensePlate: vehicle.licensePlate,
  vin: vehicle.vin,
  mileage: vehicle.mileage,
  color: vehicle.color,
  fuelType: vehicle.fuelType,
  photo: vehicle.photo,
  createdAt: vehicle.createdAt,
  updatedAt: vehicle.updatedAt,
});
