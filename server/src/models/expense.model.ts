import { Schema, model, Document, Types } from "mongoose";

export type ExpenseCategory = "fuel" | "maintenance" | "insurance" | "tax" | "tolls" | "parking" | "inspection" | "other" ;

export interface IExpense extends Document {
    vehicle: Types.ObjectId;
    category: ExpenseCategory;
    amount: number;
    date: Date;
    description?: string;
    maintenanceRecord?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
    {
        vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
        category: { type: String, enum: ["fuel", "maintenance", "insurance", "tax", 
            "tolls", "parking", "inspection", "other"], required: true },
        amount: { type: Number, required: true },
        date: { type: Date, required: true },
        description: { type: String },
        maintenanceRecord: { type: Schema.Types.ObjectId, ref: "MaintenanceRecord" },
    },
        { timestamps: true }
    
);

export const ExpenseModel = model<IExpense>("Expense", expenseSchema);