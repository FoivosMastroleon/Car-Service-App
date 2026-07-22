import { Router } from "express";
import {
  createMaintenanceType,
  getAllMaintenanceTypes,
  getMaintenanceTypeById,
  updateMaintenanceType,
  deleteMaintenanceType,
} from "../controller/maintenanceType.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createMaintenanceTypeSchema,
  updateMaintenanceTypeSchema,
} from "../validators/maintenanceType.validator";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate);

router.post("/", requireRole("admin"), validate(createMaintenanceTypeSchema), createMaintenanceType);
router.get("/", getAllMaintenanceTypes);
router.get("/:id", getMaintenanceTypeById);
router.patch("/:id", requireRole("admin"), validate(updateMaintenanceTypeSchema), updateMaintenanceType);
router.delete("/:id", requireRole("admin"), deleteMaintenanceType);

export default router;
