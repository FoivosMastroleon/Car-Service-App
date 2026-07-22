import * as maintenanceRecordDao from "../dao/maintenanceRecord.dao";
import * as vehicleDao from "../dao/vehicle.dao";
import { toMaintenanceRecordDTO } from "../mappers/maintenanceRecord.mapper";
import { AppError } from "../utils/AppError";
import {
  CreateMaintenanceRecordInput,
  UpdateMaintenanceRecordInput,
} from "../validators/maintenanceRecord.validator";
import { UserRole } from "../models/user.model";
import { Types } from "mongoose";

const getOwnedVehicleOrThrow = async (
  vehicleId: string,
  requester: { userId: string; role: UserRole }
) => {
  const vehicle = await vehicleDao.findVehicleById(vehicleId);
  if (!vehicle) throw new AppError("Vehicle not found", 404);

  if (requester.role !== "admin" && String(vehicle.owner) !== requester.userId) {
    throw new AppError("Insufficient permissions", 403);
  }

  return vehicle;
};

export const createMaintenanceRecord = async (
  vehicleId: string,
  input: CreateMaintenanceRecordInput,
  requester: { userId: string; role: UserRole }
) => {
  const vehicle = await getOwnedVehicleOrThrow(vehicleId, requester);

  const record = await maintenanceRecordDao.createRecord({
    ...input,
    vehicle: new Types.ObjectId(vehicleId),
    maintenanceType: new Types.ObjectId(input.maintenanceType),
  });

  if (input.mileageAtService > vehicle.mileage) {
    await vehicleDao.updateVehicle(vehicleId, { mileage: input.mileageAtService });
  }

  return toMaintenanceRecordDTO(record);
};

export const getMaintenanceRecordsForVehicle = async (
  vehicleId: string,
  requester: { userId: string; role: UserRole }
) => {
  await getOwnedVehicleOrThrow(vehicleId, requester);
  const records = await maintenanceRecordDao.findRecordsByVehicle(vehicleId);
  return records.map(toMaintenanceRecordDTO);
};

export const getMaintenanceRecordById = async (
  id: string,
  requester: { userId: string; role: UserRole }
) => {
  const record = await maintenanceRecordDao.findRecordById(id);
  if (!record) throw new AppError("Maintenance record not found", 404);

  await getOwnedVehicleOrThrow(String(record.vehicle), requester);

  return toMaintenanceRecordDTO(record);
};

export const updateMaintenanceRecord = async (
  id: string,
  input: UpdateMaintenanceRecordInput,
  requester: { userId: string; role: UserRole }
) => {
  const record = await maintenanceRecordDao.findRecordById(id);
  if (!record) throw new AppError("Maintenance record not found", 404);

  await getOwnedVehicleOrThrow(String(record.vehicle), requester);

  const { maintenanceType, ...rest } = input;
  const updated = await maintenanceRecordDao.updateRecord(id, {
    ...rest,
    ...(maintenanceType && { maintenanceType: new Types.ObjectId(maintenanceType) }),
  });

  return toMaintenanceRecordDTO(updated!);
};

export const deleteMaintenanceRecord = async (
  id: string,
  requester: { userId: string; role: UserRole }
) => {
  const record = await maintenanceRecordDao.findRecordById(id);
  if (!record) throw new AppError("Maintenance record not found", 404);

  await getOwnedVehicleOrThrow(String(record.vehicle), requester);

  await maintenanceRecordDao.deleteRecord(id);
};
