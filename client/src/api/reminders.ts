import axiosInstance from "@/lib/axiosInstance";
import type { Reminder } from "@/types";

export const getReminders = (vehicleId: string, includeDismissed = false) =>
  axiosInstance
    .get<Reminder[]>(`/vehicles/${vehicleId}/reminders`, { params: { includeDismissed } })
    .then((r) => r.data);

export const dismissReminder = (vehicleId: string, id: string) =>
  axiosInstance.patch<Reminder>(`/vehicles/${vehicleId}/reminders/${id}/dismiss`).then((r) => r.data);
