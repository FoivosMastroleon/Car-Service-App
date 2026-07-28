import { z } from "zod";

export const EXPENSE_CATEGORIES = [
  "fuel",
  "maintenance",
  "insurance",
  "tax",
  "tolls",
  "parking",
  "inspection",
  "washing",
  "parts",
  "fines",
  "roadside_assistance",
  "other",
] as const;

export const createExpenseSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES),
  amount: z.coerce.number().positive(),
  date: z.string().min(1, "Required"),
  description: z.string().optional(),
});

export type CreateExpenseFields = z.infer<typeof createExpenseSchema>;
