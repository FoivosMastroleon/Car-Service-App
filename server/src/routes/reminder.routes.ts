import { Router } from "express";
import { getRemindersForVehicle, dismissReminder } from "../controller/reminder.controller";

const router = Router({ mergeParams: true });

router.get("/", getRemindersForVehicle);
router.patch("/:id/dismiss", dismissReminder);

export default router;
