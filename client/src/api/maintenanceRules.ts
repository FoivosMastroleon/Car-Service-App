import axiosInstance from "@/lib/axiosInstance";
import type { MaintenanceRule } from "@/types";

export type CreateMaintenanceRuleInput = {
  maintenanceType: string;
  intervalKm?: number;
  intervalMonths?: number;
  active?: boolean;
};

export const getMaintenanceRules = (vehicleId: string) =>
  axiosInstance
    .get<MaintenanceRule[]>(`/vehicles/${vehicleId}/maintenance-rules`)
    .then((r) => r.data);

export const createMaintenanceRule = (vehicleId: string, data: CreateMaintenanceRuleInput) =>
  axiosInstance
    .post<MaintenanceRule>(`/vehicles/${vehicleId}/maintenance-rules`, data)
    .then((r) => r.data);

export const deleteMaintenanceRule = (vehicleId: string, id: string) =>
  axiosInstance.delete(`/vehicles/${vehicleId}/maintenance-rules/${id}`);
