import axiosInstance from "@/lib/axiosInstance";
import type { MaintenanceRecord } from "@/types";

export type CreateMaintenanceRecordInput = {
  maintenanceType: string;
  performedAt: string;
  mileageAtService: number;
  notes?: string;
};

export const getMaintenanceRecords = (vehicleId: string) =>
  axiosInstance
    .get<MaintenanceRecord[]>(`/vehicles/${vehicleId}/maintenance-records`)
    .then((r) => r.data);

export const createMaintenanceRecord = (vehicleId: string, data: CreateMaintenanceRecordInput) =>
  axiosInstance
    .post<MaintenanceRecord>(`/vehicles/${vehicleId}/maintenance-records`, data)
    .then((r) => r.data);

export const deleteMaintenanceRecord = (vehicleId: string, id: string) =>
  axiosInstance.delete(`/vehicles/${vehicleId}/maintenance-records/${id}`);

export const uploadMaintenanceRecordReceipt = (vehicleId: string, id: string, file: File) => {
  const formData = new FormData();
  formData.append("receipt", file);
  return axiosInstance
    .post<MaintenanceRecord>(`/vehicles/${vehicleId}/maintenance-records/${id}/receipt`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};
