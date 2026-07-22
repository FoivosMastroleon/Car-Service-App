import { MaintenanceRuleModel, IMaintenanceRule } from "../models/maintenanceRule.model";

export const findRuleById = (id: string): Promise<IMaintenanceRule | null> =>
  MaintenanceRuleModel.findById(id);

export const findRulesByVehicle = (vehicleId: string): Promise<IMaintenanceRule[]> =>
  MaintenanceRuleModel.find({ vehicle: vehicleId });

export const findRuleByVehicleAndType = (vehicleId: string, maintenanceTypeId: string): Promise<IMaintenanceRule | null> =>
  MaintenanceRuleModel.findOne({ vehicle: vehicleId, maintenanceType: maintenanceTypeId });

export const findAllRules = (): Promise<IMaintenanceRule[]> => MaintenanceRuleModel.find();

export const createRule = (data: Partial<IMaintenanceRule>): Promise<IMaintenanceRule> =>
  MaintenanceRuleModel.create(data);

export const updateRule = (id: string, data: Partial<IMaintenanceRule>): Promise<IMaintenanceRule | null> =>
  MaintenanceRuleModel.findByIdAndUpdate(id, data, { new: true });

export const deleteRule = (id: string): Promise<IMaintenanceRule | null> =>
  MaintenanceRuleModel.findByIdAndDelete(id);