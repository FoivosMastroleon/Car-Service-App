import axiosInstance from "@/lib/axiosInstance";
import type { MaintenanceStatus } from "@/types";

export const getMaintenanceStatus = (vehicleId: string) =>
  axiosInstance.get<MaintenanceStatus[]>(`/vehicles/${vehicleId}/maintenance-status`).then((r) => r.data);
