export interface MaintenanceRecordDTO {
  id: string;
  vehicle: string;
  maintenanceType: string;
  performedAt: Date;
  mileageAtService: number;
  notes?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}