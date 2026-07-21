import { z } from "zod";

export const createVehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(1),
  vin: z.string().optional(),
  mileage: z.number().int().min(0).optional(),
  color: z.string().optional(),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric", "lpg"]),
  photo: z.string().optional(),
  ownerId: z.string().optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
