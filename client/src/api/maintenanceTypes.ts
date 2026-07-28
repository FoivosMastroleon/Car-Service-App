import axiosInstance from "@/lib/axiosInstance";
import type { MaintenanceType } from "@/types";

export const getMaintenanceTypes = () =>
  axiosInstance.get<MaintenanceType[]>("/maintenance-types").then((r) => r.data);
