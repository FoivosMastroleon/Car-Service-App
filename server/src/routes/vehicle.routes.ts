import { Router } from "express";
import {
  createVehicle,
  getMyVehicles,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  uploadVehiclePhoto
} from "../controller/vehicle.controller";
import { validate } from "../middlewares/validate.middleware";
import { createVehicleSchema, updateVehicleSchema } from "../validators/vehicle.validator";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import maintenanceRuleRoutes from "./maintenanceRules.routes";
import maintenanceRecordRoutes from "./maintenanceRecords.routes";
import maintenanceStatusRoutes from "./maintenanceStatus.routes";
import expenseRoutes from "./expense.routes";
import reminderRoutes from "./reminder.routes";
import { upload } from "../middlewares/upload.middleware";


const router = Router();

router.use(authenticate);
router.use("/:vehicleId/maintenance-rules", maintenanceRuleRoutes);
router.use("/:vehicleId/reminders", reminderRoutes);
router.use("/:vehicleId/maintenance-records", maintenanceRecordRoutes);
router.use("/:vehicleId/maintenance-status", maintenanceStatusRoutes);
router.use("/:vehicleId/expenses", expenseRoutes);

router.post("/", validate(createVehicleSchema), createVehicle);
router.get("/", getMyVehicles);
router.get("/all", requireRole("admin"), getAllVehicles);
router.get("/:id", getVehicleById);
router.patch("/:id", validate(updateVehicleSchema), updateVehicle);
router.delete("/:id", deleteVehicle);
router.post("/:id/photos", upload.single("photo"), uploadVehiclePhoto);
export default router;
