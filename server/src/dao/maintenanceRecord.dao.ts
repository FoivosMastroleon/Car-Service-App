import { MaintenanceRecordModel, IMaintenanceRecord } from "../models/maintenanceRecord.model";

export const findRecordById = (id: string): Promise<IMaintenanceRecord | null> =>
  MaintenanceRecordModel.findById(id);

export const findRecordsByVehicle = (vehicleId: string): Promise<IMaintenanceRecord[]> =>
  MaintenanceRecordModel.find({ vehicle: vehicleId }).sort({ performedAt: -1 });

export const findLatestRecordByVehicleAndType = (
  vehicleId: string,
  maintenanceTypeId: string
): Promise<IMaintenanceRecord | null> =>
  MaintenanceRecordModel.findOne({ vehicle: vehicleId, maintenanceType: maintenanceTypeId }).sort({
    performedAt: -1,
  });


export const createRecord = (data: Partial<IMaintenanceRecord>): Promise<IMaintenanceRecord> =>
  MaintenanceRecordModel.create(data);

export const updateRecord = (
  id: string,
  data: Partial<IMaintenanceRecord>
): Promise<IMaintenanceRecord | null> => MaintenanceRecordModel.findByIdAndUpdate(id, data, { new: true });

export const deleteRecord = (id: string): Promise<IMaintenanceRecord | null> =>
  MaintenanceRecordModel.findByIdAndDelete(id);
