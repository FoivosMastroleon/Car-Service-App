import axiosInstance from "@/lib/axiosInstance";
import type { Vehicle } from "@/types";

export type CreateVehicleInput = {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  mileage?: number;
  color?: string;
  fuelType: Vehicle["fuelType"];
};

export const getMyVehicles = () => axiosInstance.get<Vehicle[]>("/vehicles").then((r) => r.data);

export const getVehicleById = (id: string) =>
  axiosInstance.get<Vehicle>(`/vehicles/${id}`).then((r) => r.data);

export const createVehicle = (data: CreateVehicleInput) =>
  axiosInstance.post<Vehicle>("/vehicles", data).then((r) => r.data);

export const updateVehicle = (id: string, data: Partial<CreateVehicleInput>) =>
  axiosInstance.patch<Vehicle>(`/vehicles/${id}`, data).then((r) => r.data);

export const deleteVehicle = (id: string) => axiosInstance.delete(`/vehicles/${id}`);

export const uploadVehiclePhoto = (id: string, file: File) => {
  const formData = new FormData();
  formData.append("photo", file);
  return axiosInstance
    .post<Vehicle>(`/vehicles/${id}/photos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};
