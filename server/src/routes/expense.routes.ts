import { Router } from "express";
import {
  createExpense,
  getExpensesForVehicle,
  getExpenseById,
  updateExpense,
  deleteExpense,
  uploadExpenseReceipt,
} from "../controller/expense.controller";
import { validate } from "../middlewares/validate.middleware";
import { upload } from "../middlewares/upload.middleware";
import { createExpenseSchema, updateExpenseSchema } from "../validators/expense.validator";

const router = Router({ mergeParams: true });

router.post("/", validate(createExpenseSchema), createExpense);
router.get("/", getExpensesForVehicle);
router.get("/:id", getExpenseById);
router.patch("/:id", validate(updateExpenseSchema), updateExpense);
router.delete("/:id", deleteExpense);
router.post("/:id/receipt", upload.single("receipt"), uploadExpenseReceipt);

export default router;
