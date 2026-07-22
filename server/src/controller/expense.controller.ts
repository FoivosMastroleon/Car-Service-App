import { Request, Response, NextFunction } from "express";
import * as expenseService from "../services/expense.service";

export const createExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await expenseService.createExpense(
      req.params.vehicleId as string,
      req.body,
      req.user!
    );
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export const getExpensesForVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expenses = await expenseService.getExpensesForVehicle(req.params.vehicleId as string, req.user!);
    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id as string, req.user!);
    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id as string, req.body, req.user!);
    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await expenseService.deleteExpense(req.params.id as string, req.user!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
