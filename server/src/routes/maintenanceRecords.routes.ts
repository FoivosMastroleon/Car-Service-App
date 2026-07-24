import { Router } from "express";
import {
  createMaintenanceRecord,
  getMaintenanceRecordsForVehicle,
  getMaintenanceRecordById,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  uploadMaintenanceRecordReceipt,
} from "../controller/maintenanceRecord.controller";
import { validate } from "../middlewares/validate.middleware";
import { upload } from "../middlewares/upload.middleware";
import {
  createMaintenanceRecordSchema,
  updateMaintenanceRecordSchema,
} from "../validators/maintenanceRecord.validator";

const router = Router({ mergeParams: true });

router.post("/", validate(createMaintenanceRecordSchema), createMaintenanceRecord);
router.get("/", getMaintenanceRecordsForVehicle);
router.get("/:id", getMaintenanceRecordById);
router.patch("/:id", validate(updateMaintenanceRecordSchema), updateMaintenanceRecord);
router.delete("/:id", deleteMaintenanceRecord);
router.post("/:id/receipt", upload.single("receipt"), uploadMaintenanceRecordReceipt);

export default router;
