import * as vehicleDao from "../dao/vehicle.dao";
import { toVehicleDTO } from "../mappers/vehicle.mapper";
import { AppError } from "../utils/AppError";
import { CreateVehicleInput, UpdateVehicleInput } from "../validators/vehicle.validator";
import { UserRole } from "../models/user.model";
import { Types } from "mongoose";


export const createVehicle = async (
  input: CreateVehicleInput,
  requester: { userId: string; role: UserRole }
) => {
  const owner =
    requester.role === "admin" && input.ownerId ? input.ownerId : requester.userId;

  const existingPlate = await vehicleDao.findVehicleByLicensePlate(input.licensePlate);
  if (existingPlate) throw new AppError("License plate already registered", 409);

  if (input.vin) {
    const existingVin = await vehicleDao.findVehicleByVin(input.vin);
    if (existingVin) throw new AppError("VIN already registered", 409);
  }

  const { ownerId, ...vehicleData } = input;
  const vehicle = await vehicleDao.createVehicle({ ...vehicleData, owner: new Types.ObjectId(owner) });

  return toVehicleDTO(vehicle);
};


export const getVehiclesForUser = async (userId: string) => {
  const vehicles = await vehicleDao.findVehiclesByOwner(userId);
  return vehicles.map(toVehicleDTO);
};

export const getVehicleById = async (
  id: string,
  requester: { userId: string; role: UserRole }
) => {
  const vehicle = await vehicleDao.findVehicleById(id);
  if (!vehicle) throw new AppError("Vehicle not found", 404);

  if (requester.role !== "admin" && String(vehicle.owner) !== requester.userId) {
    throw new AppError("Insufficient permissions", 403);
  }

  return toVehicleDTO(vehicle);
};

export const getAllVehicles = async () => {
  const vehicles = await vehicleDao.findAllVehicles();
  return vehicles.map(toVehicleDTO);
};

export const updateVehicle = async (
  id: string,
  input: UpdateVehicleInput,
  requester: { userId: string; role: UserRole }
) => {
  const vehicle = await vehicleDao.findVehicleById(id);
  if (!vehicle) throw new AppError("Vehicle not found", 404);

  if (requester.role !== "admin" && String(vehicle.owner) !== requester.userId) {
    throw new AppError("Insufficient permissions", 403);
  }

  const updated = await vehicleDao.updateVehicle(id, input);
  return toVehicleDTO(updated!);
};

export const deleteVehicle = async (
  id: string,
  requester: { userId: string; role: UserRole }
) => {
  const vehicle = await vehicleDao.findVehicleById(id);
  if (!vehicle) throw new AppError("Vehicle not found", 404);

  if (requester.role !== "admin" && String(vehicle.owner) !== requester.userId) {
    throw new AppError("Insufficient permissions", 403);
  }

  await vehicleDao.deleteVehicle(id);
};

