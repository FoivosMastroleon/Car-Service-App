import { IMaintenanceRule } from "../models/maintenanceRule.model";
import { MaintenanceRuleDTO } from "../dto/maintenanceRule.dto";

export const toMaintenanceRuleDTO = (maintenanceRule: IMaintenanceRule): MaintenanceRuleDTO => ({
  id: String(maintenanceRule._id),
  vehicle: String(maintenanceRule.vehicle),
  maintenanceType: String(maintenanceRule.maintenanceType),
  intervalKm: maintenanceRule.intervalKm,
  intervalMonths: maintenanceRule.intervalMonths,
  active: maintenanceRule.active,
  createdAt: maintenanceRule.createdAt,
  updatedAt: maintenanceRule.updatedAt,
});

