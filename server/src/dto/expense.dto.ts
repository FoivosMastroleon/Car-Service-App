import { ExpenseCategory } from "../models/expense.model";

export interface ExpenseDTO {
    id: string;
    vehicle: string;
    category: ExpenseCategory;
    amount: number;
    date: Date;
    description?: string;
    maintenanceRecord?: string;
    receiptUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}