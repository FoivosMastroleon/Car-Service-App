export interface MaintenanceRuleDTO {
  id: string;
  vehicle: string;
  maintenanceType: string;
  intervalKm?: number;
  intervalMonths?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}