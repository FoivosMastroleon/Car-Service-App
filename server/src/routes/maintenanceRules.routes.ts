import { Router } from "express";
import {
  createMaintenanceRule,
  getMaintenanceRulesForVehicle,
  getMaintenanceRuleById,
  updateMaintenanceRule,
  deleteMaintenanceRule
} from "../controller/maintenanceRule.controller";  

import { validate } from "../middlewares/validate.middleware";
import { createMaintenanceRuleSchema, updateMaintenanceRuleSchema } from "../validators/maintenanceRule.validator";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router({ mergeParams: true});

router.use(authenticate);

router.post("/", validate(createMaintenanceRuleSchema), createMaintenanceRule);
router.get("/", getMaintenanceRulesForVehicle);
router.get("/:id", getMaintenanceRuleById);
router.patch("/:id", validate(updateMaintenanceRuleSchema), updateMaintenanceRule);
router.delete("/:id", deleteMaintenanceRule);


export default router;