import * as expenseDao from "../dao/expense.dao";
import * as vehicleDao from "../dao/vehicle.dao";
import * as maintenanceRecordDao from "../dao/maintenanceRecord.dao";
import { toExpenseDTO } from "../mappers/expense.mapper";
import { AppError } from "../utils/AppError";
import { CreateExpenseInput, UpdateExpenseInput } from "../validators/expense.validator";
import { UserRole } from "../models/user.model";
import { Types } from "mongoose";

const getOwnedVehicleOrThrow = async (
  vehicleId: string,
  requester: { userId: string; role: UserRole }
) => {
  const vehicle = await vehicleDao.findVehicleById(vehicleId);
  if (!vehicle) throw new AppError("Vehicle not found", 404);

  if (requester.role !== "admin" && String(vehicle.owner) !== requester.userId) {
    throw new AppError("Insufficient permissions", 403);
  }

  return vehicle;
};

const assertMaintenanceRecordBelongsToVehicle = async (maintenanceRecordId: string, vehicleId: string) => {
  const record = await maintenanceRecordDao.findRecordById(maintenanceRecordId);
  if (!record) throw new AppError("Maintenance record not found", 404);
  if (String(record.vehicle) !== vehicleId) {
    throw new AppError("Maintenance record does not belong to this vehicle", 400);
  }
};

export const createExpense = async (
  vehicleId: string,
  input: CreateExpenseInput,
  requester: { userId: string; role: UserRole }
) => {
  await getOwnedVehicleOrThrow(vehicleId, requester);

  if (input.maintenanceRecord) {
    await assertMaintenanceRecordBelongsToVehicle(input.maintenanceRecord, vehicleId);
  }

  const { maintenanceRecord, ...rest } = input;
  const expense = await expenseDao.createExpense({
    ...rest,
    vehicle: new Types.ObjectId(vehicleId),
    ...(maintenanceRecord && { maintenanceRecord: new Types.ObjectId(maintenanceRecord) }),
  });

  return toExpenseDTO(expense);
};

export const getExpensesForVehicle = async (
  vehicleId: string,
  requester: { userId: string; role: UserRole }
) => {
  await getOwnedVehicleOrThrow(vehicleId, requester);
  const expenses = await expenseDao.findExpensesByVehicle(vehicleId);
  return expenses.map(toExpenseDTO);
};

export const getExpenseById = async (id: string, requester: { userId: string; role: UserRole }) => {
  const expense = await expenseDao.findExpenseById(id);
  if (!expense) throw new AppError("Expense not found", 404);

  await getOwnedVehicleOrThrow(String(expense.vehicle), requester);

  return toExpenseDTO(expense);
};

export const updateExpense = async (
  id: string,
  input: UpdateExpenseInput,
  requester: { userId: string; role: UserRole }
) => {
  const expense = await expenseDao.findExpenseById(id);
  if (!expense) throw new AppError("Expense not found", 404);

  await getOwnedVehicleOrThrow(String(expense.vehicle), requester);

  if (input.maintenanceRecord) {
    await assertMaintenanceRecordBelongsToVehicle(input.maintenanceRecord, String(expense.vehicle));
  }

  const { maintenanceRecord, ...rest } = input;
  const updated = await expenseDao.updateExpense(id, {
    ...rest,
    ...(maintenanceRecord && { maintenanceRecord: new Types.ObjectId(maintenanceRecord) }),
  });

  return toExpenseDTO(updated!);
};

export const deleteExpense = async (id: string, requester: { userId: string; role: UserRole }) => {
  const expense = await expenseDao.findExpenseById(id);
  if (!expense) throw new AppError("Expense not found", 404);

  await getOwnedVehicleOrThrow(String(expense.vehicle), requester);

  await expenseDao.deleteExpense(id);
};
