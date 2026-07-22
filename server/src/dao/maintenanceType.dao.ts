import { MaintenanceTypeModel, IMaintenanceType } from "../models/maintenanceType.model";

export const findTypeById = (id: string): Promise<IMaintenanceType | null> =>
  MaintenanceTypeModel.findById(id);

export const findTypeByName = (name: string): Promise<IMaintenanceType | null> =>
  MaintenanceTypeModel.findOne({ name });

export const findAllTypes = (): Promise<IMaintenanceType[]> => MaintenanceTypeModel.find();

export const createType = (data: Partial<IMaintenanceType>): Promise<IMaintenanceType> =>
  MaintenanceTypeModel.create(data);

export const updateType = (id: string, data: Partial<IMaintenanceType>): Promise<IMaintenanceType | null> =>
  MaintenanceTypeModel.findByIdAndUpdate(id, data, { new: true });

export const deleteType = (id: string): Promise<IMaintenanceType | null> =>
  MaintenanceTypeModel.findByIdAndDelete(id);
