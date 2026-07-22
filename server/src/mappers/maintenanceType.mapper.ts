import { IMaintenanceType } from "../models/maintenanceType.model";
import { MaintenanceTypeDTO } from "../dto/maintenanceType.dto";

export const toMaintenanceTypeDTO = (maintenanceType: IMaintenanceType): MaintenanceTypeDTO => ({
  id: String(maintenanceType._id),
  name: maintenanceType.name,
  description: maintenanceType.description,
  defaultIntervalKm: maintenanceType.defaultIntervalKm,
  defaultIntervalMonths: maintenanceType.defaultIntervalMonths,
  createdAt: maintenanceType.createdAt,
  updatedAt: maintenanceType.updatedAt,
});
