import { z } from "zod";

export const createMaintenanceRuleSchema = z
  .object({
    maintenanceType: z.string().min(1),
    intervalKm: z.number().int().min(1).optional(),
    intervalMonths: z.number().int().min(1).optional(),
    active: z.boolean().optional(),
  })
  .refine(
    (data) => data.intervalKm !== undefined || data.intervalMonths !== undefined,
    {
      message: "At least one of intervalKm or intervalMonths is required",
      path: ["intervalKm"],
    }
  );

export const updateMaintenanceRuleSchema = z.object({
  maintenanceType: z.string().min(1).optional(),
  intervalKm: z.number().int().min(1).optional(),
  intervalMonths: z.number().int().min(1).optional(),
  active: z.boolean().optional(),
});

export type CreateMaintenanceRuleInput = z.infer<typeof createMaintenanceRuleSchema>;
export type UpdateMaintenanceRuleInput = z.infer<typeof updateMaintenanceRuleSchema>;
