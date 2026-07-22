import * as maintenanceRuleDao from "../dao/maintenanceRule.dao";
import * as maintenanceRecordDao from "../dao/maintenanceRecord.dao";
import * as vehicleDao from "../dao/vehicle.dao";
import { AppError } from "../utils/AppError";
import { UserRole } from "../models/user.model";
import { IMaintenanceRule } from "../models/maintenanceRule.model";
import { IMaintenanceRecord } from "../models/maintenanceRecord.model";
import { IVehicle } from "../models/vehicle.model";
import { MaintenanceStatusDTO, MaintenanceDueStatus } from "../dto/maintenanceStatus.dto";

const KM_DUE_SOON_THRESHOLD = 500;
const DAYS_DUE_SOON_THRESHOLD = 14;

const STATUS_SEVERITY: Record<MaintenanceDueStatus, number> = {
  ok: 0,
  due_soon: 1,
  overdue: 2,
  no_history: 3,
};

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

const computeStatus = (
  rule: IMaintenanceRule,
  record: IMaintenanceRecord | null,
  vehicle: IVehicle
): MaintenanceStatusDTO => {
  const base = {
    ruleId: String(rule._id),
    maintenanceType: String(rule.maintenanceType),
    intervalKm: rule.intervalKm,
    intervalMonths: rule.intervalMonths,
  };

  if (!record) {
    return { ...base, status: "no_history" };
  }

  let remainingKm: number | undefined;
  let kmStatus: MaintenanceDueStatus = "ok";
  if (rule.intervalKm !== undefined) {
    remainingKm = rule.intervalKm - (vehicle.mileage - record.mileageAtService);
    kmStatus = remainingKm <= 0 ? "overdue" : remainingKm <= KM_DUE_SOON_THRESHOLD ? "due_soon" : "ok";
  }

  let remainingDays: number | undefined;
  let dateStatus: MaintenanceDueStatus = "ok";
  if (rule.intervalMonths !== undefined) {
    const dueDate = new Date(record.performedAt);
    dueDate.setMonth(dueDate.getMonth() + rule.intervalMonths);
    remainingDays = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    dateStatus = remainingDays <= 0 ? "overdue" : remainingDays <= DAYS_DUE_SOON_THRESHOLD ? "due_soon" : "ok";
  }

  const status = STATUS_SEVERITY[kmStatus] >= STATUS_SEVERITY[dateStatus] ? kmStatus : dateStatus;

  return {
    ...base,
    lastPerformedAt: record.performedAt,
    lastMileage: record.mileageAtService,
    remainingKm,
    remainingDays,
    status,
  };
};

export const getMaintenanceStatusForVehicle = async (
  vehicleId: string,
  requester: { userId: string; role: UserRole }
) => {
  const vehicle = await getOwnedVehicleOrThrow(vehicleId, requester);

  const rules = await maintenanceRuleDao.findRulesByVehicle(vehicleId);
  const activeRules = rules.filter((rule) => rule.active);

  return Promise.all(
    activeRules.map(async (rule) => {
      const record = await maintenanceRecordDao.findLatestRecordByVehicleAndType(
        vehicleId,
        String(rule.maintenanceType)
      );
      return computeStatus(rule, record, vehicle);
    })
  );
};
