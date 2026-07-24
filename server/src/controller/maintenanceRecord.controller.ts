import { Request, Response, NextFunction } from "express";
import * as maintenanceRecordService from "../services/maintenanceRecord.service";
import { AppError } from "../utils/AppError";

export const createMaintenanceRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await maintenanceRecordService.createMaintenanceRecord(
      req.params.vehicleId as string,
      req.body,
      req.user!
    );
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceRecordsForVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const records = await maintenanceRecordService.getMaintenanceRecordsForVehicle(
      req.params.vehicleId as string,
      req.user!
    );
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceRecordById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await maintenanceRecordService.getMaintenanceRecordById(req.params.id as string, req.user!);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

export const updateMaintenanceRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await maintenanceRecordService.updateMaintenanceRecord(
      req.params.id as string,
      req.body,
      req.user!
    );
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

export const deleteMaintenanceRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await maintenanceRecordService.deleteMaintenanceRecord(req.params.id as string, req.user!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const uploadMaintenanceRecordReceipt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) throw new AppError("No file uploaded", 400);

    const record = await maintenanceRecordService.uploadMaintenanceRecordReceipt(
      req.params.id as string,
      req.file.buffer,
      req.user!
    );
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};
