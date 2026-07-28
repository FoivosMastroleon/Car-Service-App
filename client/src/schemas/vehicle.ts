import { z } from "zod";

export const createVehicleSchema = z.object({
  make: z.string().min(1, "Required"),
  model: z.string().min(1, "Required"),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(1, "Required"),
  vin: z.string().optional(),
  mileage: z.coerce.number().int().min(0).optional(),
  color: z.string().optional(),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric", "lpg"]),
});

export type CreateVehicleFields = z.infer<typeof createVehicleSchema>;
