import { z } from "zod";

export const createMaintenanceRecordSchema = z.object({
  maintenanceType: z.string().min(1),
  performedAt: z.coerce.date(),
  mileageAtService: z.number().min(0),
  notes: z.string().optional(),
});

export const updateMaintenanceRecordSchema = createMaintenanceRecordSchema.partial();

export type CreateMaintenanceRecordInput = z.infer<typeof createMaintenanceRecordSchema>;   
export type UpdateMaintenanceRecordInput = z.infer<typeof updateMaintenanceRecordSchema>;