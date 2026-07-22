import * as maintenanceTypeDao from "../dao/maintenanceType.dao";
import { toMaintenanceTypeDTO } from "../mappers/maintenanceType.mapper";
import { AppError } from "../utils/AppError";
import {
  CreateMaintenanceTypeInput,
  UpdateMaintenanceTypeInput,
} from "../validators/maintenanceType.validator";

export const createMaintenanceType = async (input: CreateMaintenanceTypeInput) => {
  const existing = await maintenanceTypeDao.findTypeByName(input.name);
  if (existing) throw new AppError("Maintenance type name already exists", 409);

  const type = await maintenanceTypeDao.createType(input);
  return toMaintenanceTypeDTO(type);
};

export const getAllMaintenanceTypes = async () => {
  const types = await maintenanceTypeDao.findAllTypes();
  return types.map(toMaintenanceTypeDTO);
};

export const getMaintenanceTypeById = async (id: string) => {
  const type = await maintenanceTypeDao.findTypeById(id);
  if (!type) throw new AppError("Maintenance type not found", 404);

  return toMaintenanceTypeDTO(type);
};

export const updateMaintenanceType = async (id: string, input: UpdateMaintenanceTypeInput) => {
  const type = await maintenanceTypeDao.findTypeById(id);
  if (!type) throw new AppError("Maintenance type not found", 404);

  if (input.name) {
    const existingWithName = await maintenanceTypeDao.findTypeByName(input.name);
    if (existingWithName && String(existingWithName._id) !== id) {
      throw new AppError("Maintenance type name already exists", 409);
    }
  }

  const updated = await maintenanceTypeDao.updateType(id, input);
  return toMaintenanceTypeDTO(updated!);
};

export const deleteMaintenanceType = async (id: string) => {
  const type = await maintenanceTypeDao.findTypeById(id);
  if (!type) throw new AppError("Maintenance type not found", 404);

  await maintenanceTypeDao.deleteType(id);
};
