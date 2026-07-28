import { z } from "zod";

export const createMaintenanceRecordSchema = z.object({
  maintenanceType: z.string().min(1, "Required"),
  performedAt: z.string().min(1, "Required"),
  mileageAtService: z.coerce.number().int().min(0),
  notes: z.string().optional(),
});

export type CreateMaintenanceRecordFields = z.infer<typeof createMaintenanceRecordSchema>;
