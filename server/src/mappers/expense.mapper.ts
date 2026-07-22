import { IExpense } from "../models/expense.model";
import { ExpenseDTO } from "../dto/expense.dto";

export const toExpenseDTO = (expense: IExpense): ExpenseDTO => ({
  id: expense._id.toString(),
  vehicle: expense.vehicle.toString(),
  category: expense.category,
  amount: expense.amount,
  date: expense.date,
  description: expense.description,
  maintenanceRecord: expense.maintenanceRecord?.toString(),
  createdAt: expense.createdAt,
  updatedAt: expense.updatedAt
});