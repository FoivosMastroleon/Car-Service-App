import { IMaintenanceRecord } from "../models/maintenanceRecord.model";
import { MaintenanceRecordDTO } from "../dto/maintenanceRecord.dto";

export const toMaintenanceRecordDTO = (maintenanceRecord: IMaintenanceRecord): MaintenanceRecordDTO => ({
  id: String(maintenanceRecord._id),
  vehicle: String(maintenanceRecord.vehicle),
  maintenanceType: String(maintenanceRecord.maintenanceType),
  performedAt: maintenanceRecord.performedAt,
  mileageAtService: maintenanceRecord.mileageAtService,
  notes: maintenanceRecord.notes,
  createdAt: maintenanceRecord.createdAt,
  updatedAt: maintenanceRecord.updatedAt,
});