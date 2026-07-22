export interface MaintenanceTypeDTO {
  id: string;
  name: string;
  description?: string;
  defaultIntervalKm?: number;
  defaultIntervalMonths?: number;
  createdAt: Date;
  updatedAt: Date;
}
