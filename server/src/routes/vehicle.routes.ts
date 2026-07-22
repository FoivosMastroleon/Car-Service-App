import { Router } from "express";
import {
  createVehicle,
  getMyVehicles,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controller/vehicle.controller";
import { validate } from "../middlewares/validate.middleware";
import { createVehicleSchema, updateVehicleSchema } from "../validators/vehicle.validator";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import maintenanceRuleRoutes from "./maintenanceRules.routes";
import maintenanceRecordRoutes from "./maintenanceRecords.routes";

const router = Router();

router.use(authenticate);
router.use("/:vehicleId/maintenance-rules", maintenanceRuleRoutes);
router.use("/:vehicleId/maintenance-records", maintenanceRecordRoutes);

router.post("/", validate(createVehicleSchema), createVehicle);
router.get("/", getMyVehicles);
router.get("/all", requireRole("admin"), getAllVehicles);
router.get("/:id", getVehicleById);
router.patch("/:id", validate(updateVehicleSchema), updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
