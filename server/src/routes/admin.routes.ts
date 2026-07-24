import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { getAllMaintenanceRules, getAllMaintenanceRecords, getAllExpenses,} from "../controller/admin.controller";

const router = Router();

router.use(authenticate);
router.use(requireRole("admin"));

router.get("/maintenance-rules", getAllMaintenanceRules);
router.get("/maintenance-records", getAllMaintenanceRecords);
router.get("/expenses", getAllExpenses);

export default router;
