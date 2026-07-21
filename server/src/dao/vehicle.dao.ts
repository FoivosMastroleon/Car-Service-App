import { VehicleModel, IVehicle } from "../models/vehicle.model";

export const findVehiclesByOwner = (ownerId: string): Promise<IVehicle[]> =>
  VehicleModel.find({ owner: ownerId });

export const findVehicleById = (id: string): Promise<IVehicle | null> =>
  VehicleModel.findById(id);

export const findVehicleByLicensePlate = (licensePlate: string): Promise<IVehicle | null> =>
  VehicleModel.findOne({ licensePlate });

export const findVehicleByVin = (vin: string): Promise<IVehicle | null> =>
  VehicleModel.findOne({ vin });

export const findAllVehicles = (): Promise<IVehicle[]> => VehicleModel.find();

export const createVehicle = (data: Partial<IVehicle>): Promise<IVehicle> =>
  VehicleModel.create(data);

export const updateVehicle = (id: string, data: Partial<IVehicle>): Promise<IVehicle | null> =>
  VehicleModel.findByIdAndUpdate(id, data, { new: true });

export const deleteVehicle = (id: string): Promise<IVehicle | null> =>
  VehicleModel.findByIdAndDelete(id);
