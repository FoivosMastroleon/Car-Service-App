import { Request, Response, NextFunction } from "express";
import * as maintenanceRuleService from "../services/maintenanceRule.service";
import * as maintenanceRecordService from "../services/maintenanceRecord.service";
import * as expenseService from "../services/expense.service";

export const getAllMaintenanceRules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rules = await maintenanceRuleService.getAllRules();
    res.status(200).json(rules);
  } catch (error) {
    next(error);
  }
};

export const getAllMaintenanceRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const records = await maintenanceRecordService.getAllRecords();
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

export const getAllExpenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expenses = await expenseService.getAllExpenses();
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};
