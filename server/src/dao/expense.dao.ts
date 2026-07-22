import { ExpenseModel, IExpense } from "../models/expense.model";

export const findExpenseById = (id: string): Promise<IExpense | null> =>
  ExpenseModel.findById(id);

export const findExpensesByVehicle = (vehicleId: string): Promise<IExpense[]> =>
  ExpenseModel.find({ vehicle: vehicleId }).sort({ date: -1 });

export const createExpense = (data: Partial<IExpense>): Promise<IExpense> =>
  ExpenseModel.create(data);

export const updateExpense = (id: string, data: Partial<IExpense>): Promise<IExpense | null> =>
  ExpenseModel.findByIdAndUpdate(id, data, { new: true });

export const deleteExpense = (id: string): Promise<IExpense | null> =>
  ExpenseModel.findByIdAndDelete(id);
