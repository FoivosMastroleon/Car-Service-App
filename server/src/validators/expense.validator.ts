import { z } from "zod";

export const createExpenseSchema = z.object({
  category: z.enum(["fuel", "maintenance", "insurance", "tax", "tolls", "parking", "inspection", "other"]),
  amount: z.number().positive(),
  date: z.coerce.date(),
  description: z.string().max(200).optional(),
  maintenanceRecord: z.string().min(1).optional()
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;