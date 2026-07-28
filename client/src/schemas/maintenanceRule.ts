import { z } from "zod";

export const createMaintenanceRuleSchema = z
  .object({
    maintenanceType: z.string().min(1, "Required"),
    intervalKm: z.string().optional(),
    intervalMonths: z.string().optional(),
  })
  .refine((data) => !!data.intervalKm || !!data.intervalMonths, {
    message: "At least one interval (km or months) is required",
    path: ["intervalKm"],
  });

export type CreateMaintenanceRuleFields = z.infer<typeof createMaintenanceRuleSchema>;
