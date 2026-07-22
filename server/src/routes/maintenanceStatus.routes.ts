import { Router } from "express";
import { getMaintenanceStatusForVehicle } from "../controller/maintenanceStatus.controller";

const router = Router({ mergeParams: true });

router.get("/", getMaintenanceStatusForVehicle);

export default router;
