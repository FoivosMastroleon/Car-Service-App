export type UserRole = "owner" | "mechanic" | "admin";

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type FuelType = "petrol" | "diesel" | "hybrid" | "electric" | "lpg";

export type Vehicle = {
  id: string;
  owner: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  mileage: number;
  color?: string;
  fuelType: FuelType;
  photo?: string;
  createdAt: string;
  updatedAt: string;
};

export type MaintenanceType = {
  id: string;
  name: string;
  description?: string;
  defaultIntervalKm?: number;
  defaultIntervalMonths?: number;
  createdAt: string;
  updatedAt: string;
};

export type MaintenanceRule = {
  id: string;
  vehicle: string;
  maintenanceType: string;
  intervalKm?: number;
  intervalMonths?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MaintenanceRecord = {
  id: string;
  vehicle: string;
  maintenanceType: string;
  performedAt: string;
  mileageAtService: number;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseCategory =
  | "fuel"
  | "maintenance"
  | "insurance"
  | "tax"
  | "tolls"
  | "parking"
  | "inspection"
  | "washing"
  | "parts"
  | "fines"
  | "roadside_assistance"
  | "other";

export type Expense = {
  id: string;
  vehicle: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description?: string;
  maintenanceRecord?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type ReminderStatus = "due_soon" | "overdue";

export type Reminder = {
  id: string;
  vehicle: string;
  maintenanceRule: string;
  status: ReminderStatus;
  baselineRecord: string;
  dismissed: boolean;
  dismissedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type MaintenanceDueStatus = "ok" | "due_soon" | "overdue" | "no_history";

export type MaintenanceStatus = {
  ruleId: string;
  maintenanceType: string;
  intervalKm?: number;
  intervalMonths?: number;
  lastPerformedAt?: string;
  lastMileage?: number;
  lastRecordId?: string;
  remainingKm?: number;
  remainingDays?: number;
  status: MaintenanceDueStatus;
};
