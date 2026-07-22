import { z } from "zod";

export const createMaintenanceTypeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  defaultIntervalKm: z.number().int().min(1).optional(),
  defaultIntervalMonths: z.number().int().min(1).optional(),
});

export const updateMaintenanceTypeSchema = createMaintenanceTypeSchema.partial();

export type CreateMaintenanceTypeInput = z.infer<typeof createMaintenanceTypeSchema>;
export type UpdateMaintenanceTypeInput = z.infer<typeof updateMaintenanceTypeSchema>;
