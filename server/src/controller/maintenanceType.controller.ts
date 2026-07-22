import { Request, Response, NextFunction } from "express";
import * as maintenanceTypeService from "../services/maintenanceType.service";

export const createMaintenanceType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = await maintenanceTypeService.createMaintenanceType(req.body);
    res.status(201).json(type);
  } catch (err) {
    next(err);
  }
};

export const getAllMaintenanceTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const types = await maintenanceTypeService.getAllMaintenanceTypes();
    res.status(200).json(types);
  } catch (err) {
    next(err);
  }
};

export const getMaintenanceTypeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = await maintenanceTypeService.getMaintenanceTypeById(req.params.id as string);
    res.status(200).json(type);
  } catch (err) {
    next(err);
  }
};

export const updateMaintenanceType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = await maintenanceTypeService.updateMaintenanceType(req.params.id as string, req.body);
    res.status(200).json(type);
  } catch (err) {
    next(err);
  }
};

export const deleteMaintenanceType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await maintenanceTypeService.deleteMaintenanceType(req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
