import * as maintenanceRuleDao from "../dao/maintenanceRule.dao";
import * as vehicleDao from "../dao/vehicle.dao";
import { toMaintenanceRuleDTO } from "../mappers/maintenanceRule.mapper";
import { AppError } from "../utils/AppError";
import { CreateMaintenanceRuleInput,UpdateMaintenanceRuleInput,} from "../validators/maintenanceRule.validator";
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

export const createMaintenanceRule = async (
  vehicleId: string,
  input: CreateMaintenanceRuleInput,
  requester: { userId: string; role: UserRole }
) => {
  await getOwnedVehicleOrThrow(vehicleId, requester);

  const existing = await maintenanceRuleDao.findRuleByVehicleAndType(
    vehicleId,
    input.maintenanceType
  );
  if (existing) throw new AppError("A rule for this maintenance type already exists", 409);

  const rule = await maintenanceRuleDao.createRule({
    ...input,
    vehicle: new Types.ObjectId(vehicleId),
    maintenanceType: new Types.ObjectId(input.maintenanceType),
  });

  return toMaintenanceRuleDTO(rule);
};

export const getMaintenanceRulesForVehicle = async (
  vehicleId: string,
  requester: { userId: string; role: UserRole }
) => {
  await getOwnedVehicleOrThrow(vehicleId, requester);
  const rules = await maintenanceRuleDao.findRulesByVehicle(vehicleId);
  return rules.map(toMaintenanceRuleDTO);
};

export const getMaintenanceRuleById = async (
  id: string,
  requester: { userId: string; role: UserRole }
) => {
  const rule = await maintenanceRuleDao.findRuleById(id);
  if (!rule) throw new AppError("Maintenance rule not found", 404);

  await getOwnedVehicleOrThrow(String(rule.vehicle), requester);

  return toMaintenanceRuleDTO(rule);
};

export const updateMaintenanceRule = async (
  id: string,
  input: UpdateMaintenanceRuleInput,
  requester: { userId: string; role: UserRole }
) => {
  const rule = await maintenanceRuleDao.findRuleById(id);
  if (!rule) throw new AppError("Maintenance rule not found", 404);

  await getOwnedVehicleOrThrow(String(rule.vehicle), requester);

  const { maintenanceType, ...rest } = input;
  const updated = await maintenanceRuleDao.updateRule(id, {
    ...rest,
    ...(maintenanceType && { maintenanceType: new Types.ObjectId(maintenanceType) }),
  });

  return toMaintenanceRuleDTO(updated!);
};


export const deleteMaintenanceRule = async (
  id: string,
  requester: { userId: string; role: UserRole }
) => {
  const rule = await maintenanceRuleDao.findRuleById(id);
  if (!rule) throw new AppError("Maintenance rule not found", 404);

  await getOwnedVehicleOrThrow(String(rule.vehicle), requester);

  await maintenanceRuleDao.deleteRule(id);
};
