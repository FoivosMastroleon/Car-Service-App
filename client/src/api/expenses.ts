import axiosInstance from "@/lib/axiosInstance";
import type { Expense } from "@/types";

export type CreateExpenseInput = {
  category: Expense["category"];
  amount: number;
  date: string;
  description?: string;
  maintenanceRecord?: string;
};

export const getExpenses = (vehicleId: string) =>
  axiosInstance.get<Expense[]>(`/vehicles/${vehicleId}/expenses`).then((r) => r.data);

export const createExpense = (vehicleId: string, data: CreateExpenseInput) =>
  axiosInstance.post<Expense>(`/vehicles/${vehicleId}/expenses`, data).then((r) => r.data);

export const updateExpense = (vehicleId: string, id: string, data: Partial<CreateExpenseInput>) =>
  axiosInstance.patch<Expense>(`/vehicles/${vehicleId}/expenses/${id}`, data).then((r) => r.data);

export const deleteExpense = (vehicleId: string, id: string) =>
  axiosInstance.delete(`/vehicles/${vehicleId}/expenses/${id}`);

export const uploadExpenseReceipt = (vehicleId: string, id: string, file: File) => {
  const formData = new FormData();
  formData.append("receipt", file);
  return axiosInstance
    .post<Expense>(`/vehicles/${vehicleId}/expenses/${id}/receipt`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};
