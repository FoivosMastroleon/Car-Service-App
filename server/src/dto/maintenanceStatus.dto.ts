export type MaintenanceDueStatus = "ok" | "due_soon" | "overdue" | "no_history";

export interface MaintenanceStatusDTO {
  ruleId: string;
  maintenanceType: string;
  intervalKm?: number;
  intervalMonths?: number;
  lastPerformedAt?: Date;
  lastMileage?: number;
  remainingKm?: number;
  remainingDays?: number;
  status: MaintenanceDueStatus;
}
